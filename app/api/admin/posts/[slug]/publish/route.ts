import { NextResponse } from "next/server";

import { formatZodErrors, publishCreatePostSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/admin-auth";
import { BLOG_DEFAULT_REVALIDATE_TAGS, revalidateCacheTags } from "@/lib/blog/cache-tags";
import { notifySubscribers } from "@/lib/blog/notify-subscribers";

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
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          {
            ok: false,
            error: "MISSING_POST_BODY_REQUIRED",
            message: `Post "${slug}" does not exist. Send JSON with title, excerpt, and contentMdx to create and publish.`,
          },
          { status: 400, headers: ADMIN_HEADERS },
        );
      }

      const parsed = publishCreatePostSchema.safeParse(body);
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
        title,
        excerpt,
        contentMdx,
        coverImage,
        isFeatured,
        publishedAt,
        categories,
        tags,
      } = parsed.data;

      if (!contentMdx.trim()) {
        return NextResponse.json(
          {
            ok: false,
            error: "PUBLISH_VALIDATION_FAILED",
            message: "Cannot publish a post with empty content",
          },
          { status: 422, headers: ADMIN_HEADERS },
        );
      }

      const created = await prisma.$transaction(async (tx) => {
        const categoryIds: string[] = [];
        if (categories?.length) {
          for (const catSlug of categories) {
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

        const tagIds: string[] = [];
        if (tags?.length) {
          for (const tagSlug of tags) {
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

        return tx.post.create({
          data: {
            slug,
            title,
            excerpt,
            contentMdx,
            status: "PUBLISHED",
            coverImage: coverImage ?? null,
            isFeatured,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            categories: {
              create: categoryIds.map((id) => ({ categoryId: id })),
            },
            tags: {
              create: tagIds.map((id) => ({ tagId: id })),
            },
          },
        });
      });

      console.log(
        JSON.stringify({
          event: "admin.post.created_and_published",
          slug,
          timestamp: new Date().toISOString(),
        }),
      );

      revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);
      notifySubscribers(slug, created.title).catch(() => {});

      return NextResponse.json(
        {
          ok: true,
          created: true,
          post: {
            slug: created.slug,
            status: created.status,
            publishedAt: created.publishedAt?.toISOString() ?? null,
            revisionId: created.updatedAt.toISOString(),
          },
        },
        { status: 201, headers: ADMIN_HEADERS },
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

    // Notify subscribers (non-blocking — don't await)
    notifySubscribers(slug, updated.title).catch(() => {});

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
