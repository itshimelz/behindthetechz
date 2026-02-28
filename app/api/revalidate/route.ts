import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const DEFAULT_TAGS = [
  "blog:posts",
  "blog:categories",
  "blog:tags",
  "blog:backlinks",
  "blog:graph",
];

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const providedToken =
    request.headers.get("x-revalidate-token") ||
    new URL(request.url).searchParams.get("secret");

  if (secret && providedToken !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let tags = DEFAULT_TAGS;

  try {
    const payload = (await request.json()) as { tags?: string[] };
    if (Array.isArray(payload.tags) && payload.tags.length > 0) {
      tags = payload.tags;
    }
  } catch {
    // Keep default tags when no JSON body is provided.
  }

  const uniqueTags = [...new Set(tags.filter(Boolean))];
  uniqueTags.forEach((tag) => revalidateTag(tag, "max"));

  return NextResponse.json({
    ok: true,
    revalidated: uniqueTags,
    now: Date.now(),
  });
}
