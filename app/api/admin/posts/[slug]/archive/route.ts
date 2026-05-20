import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// POST /api/admin/posts/[slug]/archive — Archive from any status
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

    const updated = await prisma.post.update({
      where: { slug },
      data: { status: "ARCHIVED" },
    });

    console.log(
      JSON.stringify({
        event: "admin.post.archived",
        slug,
        previousStatus: post.status,
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
    console.error("[admin/posts/[slug]/archive]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
