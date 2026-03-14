import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Rate-limiting (in-memory, per-IP)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 attempts per IP per window

const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Periodic cleanup to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipAttempts) {
    if (now > entry.resetAt) ipAttempts.delete(ip);
  }
}, 10 * 60 * 1000); // every 10 minutes

// ---------------------------------------------------------------------------
// Email validation
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email);
}

// ---------------------------------------------------------------------------
// Cookie-based repeat protection
// ---------------------------------------------------------------------------
const SUB_COOKIE = "btz_newsletter_sub";
const SUB_COOKIE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

// ---------------------------------------------------------------------------
// POST /api/newsletter/subscribe
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // --- IP rate limiting ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    // Return success-like response to avoid leaking info
    return NextResponse.json({ ok: true });
  }

  // --- Cookie-based repeat protection ---
  const alreadySubscribed = request.cookies.get(SUB_COOKIE)?.value === "1";
  if (alreadySubscribed) {
    return NextResponse.json({ ok: true });
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  // --- Honeypot: if `website` field is filled, it's a bot ---
  if (body.website) {
    // Silently accept to not reveal the trap
    return NextResponse.json({ ok: true });
  }

  // --- Email validation ---
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address" },
      { status: 400 },
    );
  }

  try {
    // Upsert: create new or re-subscribe if previously unsubscribed
    await prisma.subscriber.upsert({
      where: { email },
      create: { email },
      update: {
        confirmed: true,
        unsubscribedAt: null,
      },
    });

    const response = NextResponse.json({ ok: true });

    // Set cookie to prevent repeated submissions from same browser
    response.cookies.set({
      name: SUB_COOKIE,
      value: "1",
      maxAge: SUB_COOKIE_TTL_SECONDS,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[newsletter/subscribe]", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
