import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { createPostSchema, formatZodErrors } from "@/lib/admin/validation";
import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";

import { slugify } from "@/lib/admin/slug";
import { formatFullPost } from "@/lib/admin/post-response";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

// ---------------------------------------------------------------------------
// GET /api/admin/posts — List posts (supports ?status=DRAFT filter)
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status")?.toUpperCase();

    const where = statusFilter
      ? { status: statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
      : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    const mapped = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      status: post.status,
      isFeatured: post.isFeatured,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      updatedAt: post.updatedAt.toISOString(),
      createdAt: post.createdAt.toISOString(),
      categories: post.categories.map((pc) => pc.category.slug),
      tags: post.tags.map((pt) => pt.tag.slug),
      revisionId: post.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      { ok: true, posts: mapped },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts GET]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/posts — Create a new post
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

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

    const {
      slug,
      title,
      excerpt,
      contentMdx,
      status,
      coverImage,
      isFeatured,
      publishedAt,
      categories,
      tags,
    } = parsed.data;

    // Check for slug conflict
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "SLUG_CONFLICT",
          message: `Post with slug "${slug}" already exists`,
        },
        { status: 409, headers: ADMIN_HEADERS },
      );
    }

    const post = await prisma.$transaction(async (tx) => {
      // Upsert categories
      const categoryIds: string[] = [];
      if (categories?.length) {
        for (const rawCat of categories) {
          const catSlug = slugify(rawCat);
          if (!catSlug) continue;
          const cat = await tx.category.upsert({
            where: { slug: catSlug },
            update: {},
            create: {
              name: catSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              slug: catSlug,
            },
          });
          categoryIds.push(cat.id);
        }
      }

      // Upsert tags
      const tagIds: string[] = [];
      if (tags?.length) {
        for (const rawTag of tags) {
          const tagSlug = slugify(rawTag);
          if (!tagSlug) continue;
          const tag = await tx.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
              name: tagSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
              slug: tagSlug,
            },
          });
          tagIds.push(tag.id);
        }
      }

      // Create the post
      const newPost = await tx.post.create({
        data: {
          slug,
          title,
          excerpt,
          contentMdx,
          status,
          coverImage: coverImage ?? null,
          isFeatured,
          publishedAt: publishedAt
            ? new Date(publishedAt)
            : status === "PUBLISHED"
              ? new Date()
              : null,
          categories: {
            create: categoryIds.map((id) => ({ categoryId: id })),
          },
          tags: {
            create: tagIds.map((id) => ({ tagId: id })),
          },
        },
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
      });

      return newPost;
    });

    // Audit log
    console.log(
      JSON.stringify({
        event: "admin.post.created",
        slug: post.slug,
        timestamp: new Date().toISOString(),
      }),
    );

    // Revalidate cache
    revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);

    return NextResponse.json(
      {
        ok: true,
        post: formatFullPost(post),
      },
      { status: 201, headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts POST]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
