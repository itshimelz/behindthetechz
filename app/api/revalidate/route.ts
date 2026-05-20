import { NextResponse } from "next/server";
import crypto from "crypto";

import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const providedToken =
    request.headers.get("x-revalidate-token") ||
    new URL(request.url).searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_AUTH_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const tokenBuffer = Buffer.from(providedToken || "");
  const secretBuffer = Buffer.from(secret);

  let isMatch = false;
  if (tokenBuffer.length === secretBuffer.length) {
    isMatch = crypto.timingSafeEqual(tokenBuffer, secretBuffer);
  } else {
    crypto.timingSafeEqual(tokenBuffer, tokenBuffer);
  }

  if (!isMatch) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let tags: string[] = [...BLOG_DEFAULT_REVALIDATE_TAGS];

  try {
    const payload = (await request.json()) as { tags?: string[] };
    if (Array.isArray(payload.tags) && payload.tags.length > 0) {
      tags = payload.tags;
    }
  } catch {
    // Keep default tags when no JSON body is provided.
  }

  const uniqueTags = revalidateCacheTags(tags);

  return NextResponse.json({
    ok: true,
    revalidated: uniqueTags,
    now: Date.now(),
  });
}
