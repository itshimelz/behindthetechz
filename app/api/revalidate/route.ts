import { NextResponse } from "next/server";
import crypto from "crypto";

import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

export async function POST(request: Request) {
  const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const providedToken =
    request.headers.get("x-revalidate-token") ||
    bearerToken ||
    new URL(request.url).searchParams.get("secret");

  const validSecrets = [
    process.env.REVALIDATE_SECRET,
    process.env.BEHINDTHETECHZ_API_TOKEN,
    process.env.ADMIN_API_TOKEN,
  ].filter(Boolean) as string[];

  if (validSecrets.length === 0) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_AUTH_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const tokenBuffer = Buffer.from(providedToken || "");
  let isMatch = false;

  for (const secret of validSecrets) {
    const secretBuffer = Buffer.from(secret);
    if (tokenBuffer.length === secretBuffer.length) {
      if (crypto.timingSafeEqual(tokenBuffer, secretBuffer)) {
        isMatch = true;
        break;
      }
    }
  }

  if (!isMatch) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED", message: "Unauthorized" },
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
