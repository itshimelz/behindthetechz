import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { slug: string };

const VIEWED_POSTS_COOKIE = "btz_viewed_posts";
const VIEW_COOKIE_TTL_SECONDS = 60 * 60 * 6;
const MAX_TRACKED_SLUGS = 120;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const viewRateLimitStore = new Map<string, number>();

let lastRateLimitCleanup = Date.now();
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  const ip = (request as NextRequest & { ip?: string }).ip;
  if (ip) return ip;

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

  for (const [key, timestamp] of viewRateLimitStore) {
    if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
      viewRateLimitStore.delete(key);
    }
  }

  if (viewRateLimitStore.size > 10000) {
    const keysToDelete = Array.from(viewRateLimitStore.keys()).slice(0, 1000);
    for (const key of keysToDelete) {
      viewRateLimitStore.delete(key);
    }
  }
}

function isRateLimited(request: NextRequest, slug: string): boolean {
  cleanupRateLimitStore();

  const ip = getClientIp(request);
  
  if (viewRateLimitStore.size > 12000) {
    const keysToDelete = Array.from(viewRateLimitStore.keys()).slice(0, 3000);
    for (const key of keysToDelete) {
      viewRateLimitStore.delete(key);
    }
  }

  const key = `${ip}:${slug}`;
  const now = Date.now();
  const lastView = viewRateLimitStore.get(key);

  if (lastView && now - lastView < RATE_LIMIT_WINDOW_MS) {
    return true;
  }

  viewRateLimitStore.set(key, now);
  return false;
}

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

  const rateLimited = isRateLimited(request, slug);

  try {
    if (alreadyCounted || rateLimited) {
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
