import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { slug: string };

const VIEWED_POSTS_COOKIE = "btz_viewed_posts";
const VIEW_COOKIE_TTL_SECONDS = 60 * 60 * 6;
const MAX_TRACKED_SLUGS = 120;

function parseViewedSlugs(cookieValue?: string): string[] {
  if (!cookieValue) {
    return [];
  }

  return cookieValue
    .split(",")
    .map((entry) => decodeURIComponent(entry))
    .filter(Boolean);
}

function serializeViewedSlugs(slugs: string[]): string {
  return slugs.map((entry) => encodeURIComponent(entry)).join(",");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const viewedSlugs = parseViewedSlugs(
    request.cookies.get(VIEWED_POSTS_COOKIE)?.value,
  );
  const alreadyCounted = viewedSlugs.includes(slug);

  try {
    if (alreadyCounted) {
      const post = await prisma.post.findUnique({
        where: { slug },
        select: { viewCount: true },
      });

      if (!post) {
        return NextResponse.json({ viewCount: 0 }, { status: 404 });
      }

      return NextResponse.json({ viewCount: post.viewCount, counted: false });
    }

    const post = await prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    const response = NextResponse.json({ viewCount: post.viewCount, counted: true });
    const nextViewedSlugs = [...viewedSlugs, slug].slice(-MAX_TRACKED_SLUGS);

    response.cookies.set({
      name: VIEWED_POSTS_COOKIE,
      value: serializeViewedSlugs(nextViewedSlugs),
      maxAge: VIEW_COOKIE_TTL_SECONDS,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ viewCount: 0 }, { status: 404 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { viewCount: true },
    });

    return NextResponse.json({ viewCount: post?.viewCount ?? 0 });
  } catch {
    return NextResponse.json({ viewCount: 0 }, { status: 404 });
  }
}
