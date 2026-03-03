import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// POST /api/admin/posts/[slug]/publish — Publish a post
// ---------------------------------------------------------------------------
export async function POST(request: Request, context: RouteContext) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND", message: `Post "${slug}" not found` },
        { status: 404, headers: ADMIN_HEADERS },
      );
    }

    // Validate: content must not be empty
    if (!post.contentMdx || post.contentMdx.trim().length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "PUBLISH_VALIDATION_FAILED",
          message: "Cannot publish a post with empty content",
        },
        { status: 422, headers: ADMIN_HEADERS },
      );
    }

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        status: "PUBLISHED",
        publishedAt: post.publishedAt ?? new Date(),
      },
    });

    console.log(
      JSON.stringify({
        event: "admin.post.published",
        slug,
        timestamp: new Date().toISOString(),
      }),
    );

    revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);

    return NextResponse.json(
      {
        ok: true,
        post: {
          slug: updated.slug,
          status: updated.status,
          publishedAt: updated.publishedAt?.toISOString() ?? null,
          revisionId: updated.updatedAt.toISOString(),
        },
      },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/[slug]/publish]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
