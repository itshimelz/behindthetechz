import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { validateAdminRequest } from "@/lib/admin-auth";
import { formatZodErrors, updatePostSchema } from "@/lib/admin/validation";
import {
  BLOG_DEFAULT_REVALIDATE_TAGS,
  revalidateCacheTags,
} from "@/lib/blog/cache-tags";
import { prisma } from "@/lib/prisma";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

type RouteContext = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// GET /api/admin/posts/[slug] — Get a single post with full content
// ---------------------------------------------------------------------------
export async function GET(request: Request, context: RouteContext) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND", message: `Post "${slug}" not found` },
        { status: 404, headers: ADMIN_HEADERS },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        post: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          contentMdx: post.contentMdx,
          status: post.status,
          isFeatured: post.isFeatured,
          coverImage: post.coverImage,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          updatedAt: post.updatedAt.toISOString(),
          createdAt: post.createdAt.toISOString(),
          categories: post.categories.map((pc) => pc.category.slug),
          tags: post.tags.map((pt) => pt.tag.slug),
          revisionId: post.updatedAt.toISOString(),
        },
      },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/[slug] GET]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/posts/[slug] — Partial update
// ---------------------------------------------------------------------------
export async function PATCH(request: Request, context: RouteContext) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_PAYLOAD",
          details: formatZodErrors(parsed.error),
        },
        { status: 400, headers: ADMIN_HEADERS },
      );
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND", message: `Post "${slug}" not found` },
        { status: 404, headers: ADMIN_HEADERS },
      );
    }

    const {
      categories,
      tags,
      publishedAt,
      title,
      excerpt,
      contentMdx,
      status,
      coverImage,
      isFeatured,
    } = parsed.data;

    const updateData: Prisma.PostUpdateInput = {};

    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (contentMdx !== undefined) updateData.contentMdx = contentMdx;
    if (status !== undefined) updateData.status = status;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (categories !== undefined) {
      updateData.categories = {
        deleteMany: { postId: existing.id },
        create: categories.map((categorySlug) => ({
          category: {
            connectOrCreate: {
              where: { slug: categorySlug },
              create: {
                slug: categorySlug,
                name: categorySlug
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              },
            },
          },
        })),
      };
    }

    if (tags !== undefined) {
      updateData.tags = {
        deleteMany: { postId: existing.id },
        create: tags.map((tagSlug) => ({
          tag: {
            connectOrCreate: {
              where: { slug: tagSlug },
              create: {
                slug: tagSlug,
                name: tagSlug
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              },
            },
          },
        })),
      };
    }

    const post = await prisma.post.update({
      where: { slug },
      data: updateData,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    console.log(
      JSON.stringify({
        event: "admin.post.updated",
        slug,
        fields: Object.keys(parsed.data),
        timestamp: new Date().toISOString(),
      }),
    );

    revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);

    return NextResponse.json(
      {
        ok: true,
        post: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          status: post.status,
          revisionId: post.updatedAt.toISOString(),
        },
      },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/[slug] PATCH]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/posts/[slug] — Delete a post (cascades via schema)
// ---------------------------------------------------------------------------
export async function DELETE(request: Request, context: RouteContext) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const existing = await prisma.post.findUnique({ where: { slug } });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND", message: `Post "${slug}" not found` },
        { status: 404, headers: ADMIN_HEADERS },
      );
    }

    await prisma.post.delete({ where: { slug } });

    console.log(
      JSON.stringify({
        event: "admin.post.deleted",
        slug,
        timestamp: new Date().toISOString(),
      }),
    );

    revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);

    return NextResponse.json(
      { ok: true, deleted: slug },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/[slug] DELETE]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
