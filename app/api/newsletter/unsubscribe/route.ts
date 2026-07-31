import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUB_COOKIE = "btz_newsletter_sub";

// ---------------------------------------------------------------------------
// GET /api/newsletter/unsubscribe?token=xxx  (for email footer links)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token.length < 10) {
    return new NextResponse(unsubscribePage("Invalid unsubscribe link."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { token },
    });

    if (!subscriber) {
      return new NextResponse(
        unsubscribePage("This unsubscribe link is no longer valid."),
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    if (subscriber.unsubscribedAt) {
      return new NextResponse(
        unsubscribePage("You have already been unsubscribed."),
        {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    await prisma.subscriber.update({
      where: { token },
      data: {
        confirmed: false,
        unsubscribedAt: new Date(),
      },
    });

    const response = new NextResponse(
      unsubscribePage("You have been successfully unsubscribed. Sorry to see you go!"),
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );

    response.cookies.delete(SUB_COOKIE);

    return response;
  } catch (error) {
    console.error("[newsletter/unsubscribe] GET error:", error);
    return new NextResponse(
      unsubscribePage("Something went wrong. Please try again later."),
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/newsletter/unsubscribe  (for website unsubscribe form)
// Body: { email: "user@example.com" }
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address" },
      { status: 400 },
    );
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { ok: false, error: "This email address is not on our subscriber list." },
        { status: 404 },
      );
    }

    if (subscriber.unsubscribedAt) {
      return NextResponse.json(
        { ok: false, error: "This email address has already been unsubscribed." },
        { status: 400 },
      );
    }

    await prisma.subscriber.update({
      where: { email },
      data: {
        confirmed: false,
        unsubscribedAt: new Date(),
      },
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.delete(SUB_COOKIE);

    return response;
  } catch (error) {
    console.error("[newsletter/unsubscribe] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Simple HTML confirmation page
// ---------------------------------------------------------------------------
function unsubscribePage(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unsubscribe — behind the TechZ</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #fafafa;
      color: #333;
    }
    .card {
      max-width: 420px;
      padding: 2rem;
      text-align: center;
      border-radius: 12px;
      border: 1px solid #e5e5e5;
      background: #fff;
    }
    h1 { font-size: 1.25rem; margin: 0 0 0.75rem; }
    p { font-size: 0.9rem; color: #666; margin: 0; line-height: 1.5; }
    a { color: #333; text-decoration: underline; }
    @media (prefers-color-scheme: dark) {
      body { background: #111; color: #eee; }
      .card { background: #1a1a1a; border-color: #333; }
      p { color: #aaa; }
      a { color: #eee; }
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>behind the TechZ</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
