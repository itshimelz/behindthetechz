import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

type Params = { slug: string };

const MAX_INCREMENT_PER_REQUEST = 10;
const MAX_CLAPS_PER_SESSION_PER_POST = 50;
const CLAP_SESSION_COOKIE = "btz_clap_session";
const CLAP_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

const clapRateLimitStore = new Map<string, number[]>();
let lastRateLimitCleanup = Date.now();
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 2 * 60 * 1000; // Clean up every 2 minutes

function getClientIp(request: NextRequest): string {
  if (request.ip) return request.ip;

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "unknown";
}

function cleanupRateLimitStore(): void {
  const now = Date.now();
  if (now - lastRateLimitCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;
  lastRateLimitCleanup = now;

  for (const [key, timestamps] of clapRateLimitStore) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      clapRateLimitStore.delete(key);
    } else {
      clapRateLimitStore.set(key, recent);
    }
  }

  if (clapRateLimitStore.size > 10000) {
    const keysToDelete = Array.from(clapRateLimitStore.keys()).slice(0, 1000);
    for (const key of keysToDelete) {
      clapRateLimitStore.delete(key);
    }
  }
}

function isRateLimited(request: NextRequest, slug: string): boolean {
  cleanupRateLimitStore();

  if (clapRateLimitStore.size > 12000) {
    const keysToDelete = Array.from(clapRateLimitStore.keys()).slice(0, 3000);
    for (const key of keysToDelete) {
      clapRateLimitStore.delete(key);
    }
  }

  const key = `${getClientIp(request)}:${slug}`;
  const now = Date.now();
  const previousTimestamps = clapRateLimitStore.get(key) ?? [];
  const recentTimestamps = previousTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    clapRateLimitStore.set(key, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  clapRateLimitStore.set(key, recentTimestamps);
  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;

  if (isRateLimited(request, slug)) {
    return NextResponse.json(
      { error: "Too many clap requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let incrementBy = 1;

  try {
    const body = (await request.json()) as { count?: number };
    if (typeof body.count === "number" && Number.isFinite(body.count)) {
      incrementBy = Math.trunc(body.count);
    }
  } catch {
    // Default to single clap when no JSON body is provided.
  }

  if (incrementBy < 1 || incrementBy > MAX_INCREMENT_PER_REQUEST) {
    return NextResponse.json(
      { error: "count must be between 1 and 10" },
      { status: 400 },
    );
  }

  const existingSessionId = request.cookies.get(CLAP_SESSION_COOKIE)?.value;
  const clientIp = getClientIp(request);
  const ipHash = crypto.createHash("sha256").update(clientIp + "btz_clap_salt_2026").digest("hex");
  const sessionId = existingSessionId ?? `ip-${ipHash}`;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Lock the session row with FOR UPDATE to prevent concurrent reads
      // from both allowing increments past the cap
      const currentSessionRows = await tx.$queryRaw<{ clap_count: number }[]>`
        SELECT "clap_count"
        FROM "post_clap_sessions"
        WHERE "session_id" = ${sessionId} AND "slug" = ${slug}
        LIMIT 1
        FOR UPDATE
      `;

      const currentSessionClaps = currentSessionRows[0]?.clap_count ?? 0;
      const remainingClaps = Math.max(
        0,
        MAX_CLAPS_PER_SESSION_PER_POST - currentSessionClaps,
      );
      const allowedIncrement = Math.min(incrementBy, remainingClaps);

      if (allowedIncrement > 0) {
        const clapSessionId = crypto.randomUUID();

        // Use LEAST() to hard-cap clap_count at the max, preventing overflow
        // from any concurrent writes that slip through
        await tx.$executeRaw`
          INSERT INTO "post_clap_sessions" (
            "id",
            "session_id",
            "slug",
            "clap_count",
            "created_at",
            "updated_at"
          )
          VALUES (CAST(${clapSessionId} AS UUID), ${sessionId}, ${slug}, ${allowedIncrement}, NOW(), NOW())
          ON CONFLICT ("session_id", "slug")
          DO UPDATE SET
            "clap_count" = LEAST(${MAX_CLAPS_PER_SESSION_PER_POST}, "post_clap_sessions"."clap_count" + ${allowedIncrement}),
            "updated_at" = NOW()
        `;

        await tx.$executeRaw`
          UPDATE "posts"
          SET "clap_count" = "clap_count" + ${allowedIncrement}
          WHERE "slug" = ${slug}
        `;
      }

      const postRows = await tx.$queryRaw<{ clap_count: number }[]>`
        SELECT "clap_count"
        FROM "posts"
        WHERE "slug" = ${slug}
        LIMIT 1
      `;

      return {
        clapCount: postRows[0]?.clap_count,
        allowedIncrement,
        remainingClaps: Math.max(0, remainingClaps - allowedIncrement),
      };
    });

    if (typeof result.clapCount !== "number") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      clapCount: result.clapCount,
      counted: result.allowedIncrement > 0,
      remainingClaps: result.remainingClaps,
    });

    if (!existingSessionId) {
      response.cookies.set({
        name: CLAP_SESSION_COOKIE,
        value: sessionId,
        maxAge: CLAP_SESSION_MAX_AGE_SECONDS,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to update clap count" },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;

  try {
    const rows = await prisma.$queryRaw<{ clap_count: number }[]>`
      SELECT "clap_count"
      FROM "posts"
      WHERE "slug" = ${slug}
      LIMIT 1
    `;

    return NextResponse.json({ clapCount: rows[0]?.clap_count ?? 0 });
  } catch {
    return NextResponse.json({ clapCount: 0 }, { status: 404 });
  }
}
