import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// POST /api/admin/posts/[slug]/unpublish — Revert to DRAFT
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

    // Only allow unpublish from PUBLISHED status
    if (post.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_TRANSITION",
          message: `Cannot unpublish a post with status "${post.status}". Must be PUBLISHED.`,
        },
        { status: 422, headers: ADMIN_HEADERS },
      );
    }

    const updated = await prisma.post.update({
      where: { slug },
      data: { status: "DRAFT" },
    });

    console.log(
      JSON.stringify({
        event: "admin.post.unpublished",
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
          revisionId: updated.updatedAt.toISOString(),
        },
      },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/[slug]/unpublish]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
