import { Prisma } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";

import { validateAdminRequest } from "@/lib/admin-auth";
import { formatZodErrors, syncApplySchema } from "@/lib/admin/validation";
import {
  BLOG_DEFAULT_REVALIDATE_TAGS,
  revalidateCacheTags,
} from "@/lib/blog/cache-tags";
import { prisma } from "@/lib/prisma";

const ADMIN_HEADERS = { "Cache-Control": "no-store" };

type OperationResult = {
  slug: string;
  status: "ok" | "error";
  revisionId?: string;
  error?: string;
};

function humanizeSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// POST /api/admin/posts/sync/apply — Batch create/update/delete
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = syncApplySchema.safeParse(body);

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

    const { operations } = parsed.data;
    const results: OperationResult[] = [];

    for (const op of operations) {
      try {
        switch (op.action) {
          case "create": {
            if (!op.data) {
              results.push({
                slug: op.slug,
                status: "error",
                error: "MISSING_DATA",
              });
              break;
            }

            const { categories, tags, publishedAt, series, seriesOrder, ...postFields } = op.data;
            const created = await prisma.post.create({
              data: {
                slug: op.slug,
                title: postFields.title ?? op.slug,
                excerpt: postFields.excerpt ?? "",
                contentMdx: postFields.contentMdx ?? "",
                status: postFields.status ?? "DRAFT",
                coverImage: postFields.coverImage ?? null,
                isFeatured: postFields.isFeatured ?? false,
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                series: series ? { connect: { slug: series } } : undefined,
                seriesOrder: seriesOrder ?? undefined,
                categories: {
                  create:
                    categories?.map((categorySlug) => ({
                      category: {
                        connectOrCreate: {
                          where: { slug: categorySlug },
                          create: {
                            slug: categorySlug,
                            name: humanizeSlug(categorySlug),
                          },
                        },
                      },
                    })) ?? [],
                },
                tags: {
                  create:
                    tags?.map((tagSlug) => ({
                      tag: {
                        connectOrCreate: {
                          where: { slug: tagSlug },
                          create: {
                            slug: tagSlug,
                            name: humanizeSlug(tagSlug),
                          },
                        },
                      },
                    })) ?? [],
                },
              },
            });

            console.log(
              JSON.stringify({
                event: "admin.sync.created",
                slug: op.slug,
                timestamp: new Date().toISOString(),
              }),
            );

            results.push({
              slug: op.slug,
              status: "ok",
              revisionId: created.updatedAt.toISOString(),
            });
            break;
          }

          case "update": {
            if (!op.data) {
              results.push({
                slug: op.slug,
                status: "error",
                error: "MISSING_DATA",
              });
              break;
            }

            const existing = await prisma.post.findUnique({ where: { slug: op.slug } });
            if (!existing) {
              results.push({
                slug: op.slug,
                status: "error",
                error: "NOT_FOUND",
              });
              break;
            }

            const { categories, tags, publishedAt, series, seriesOrder, ...postFields } = op.data;
            const updateData: Prisma.PostUpdateInput = { ...postFields };

            if (series !== undefined) {
              updateData.series = series ? { connect: { slug: series } } : { disconnect: true };
            }

            if (seriesOrder !== undefined) {
              updateData.seriesOrder = seriesOrder === null ? null : seriesOrder;
            }

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
                        name: humanizeSlug(categorySlug),
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
                        name: humanizeSlug(tagSlug),
                      },
                    },
                  },
                })),
              };
            }

            const updated = await prisma.post.update({
              where: { slug: op.slug },
              data: updateData,
            });

            console.log(
              JSON.stringify({
                event: "admin.sync.updated",
                slug: op.slug,
                timestamp: new Date().toISOString(),
              }),
            );

            results.push({
              slug: op.slug,
              status: "ok",
              revisionId: updated.updatedAt.toISOString(),
            });
            break;
          }

          case "delete": {
            const toDelete = await prisma.post.findUnique({
              where: { slug: op.slug },
            });
            if (!toDelete) {
              results.push({
                slug: op.slug,
                status: "error",
                error: "NOT_FOUND",
              });
              break;
            }

            await prisma.post.delete({ where: { slug: op.slug } });
            console.log(
              JSON.stringify({
                event: "admin.sync.deleted",
                slug: op.slug,
                timestamp: new Date().toISOString(),
              }),
            );
            results.push({ slug: op.slug, status: "ok" });
            break;
          }
        }
      } catch (opError) {
        const isKnownPrismaError =
          opError instanceof Prisma.PrismaClientKnownRequestError;
        const isUniqueConstraintError =
          isKnownPrismaError && opError.code === "P2002";

        console.error(
          `[admin/sync/apply] Error processing ${op.action} for "${op.slug}":`,
          opError,
        );

        results.push({
          slug: op.slug,
          status: "error",
          error: isUniqueConstraintError ? "SLUG_CONFLICT" : "OPERATION_FAILED",
        });
      }
    }

    const revalidatedTags = revalidateCacheTags(BLOG_DEFAULT_REVALIDATE_TAGS);

    return NextResponse.json(
      { ok: true, results, revalidated: revalidatedTags },
      { headers: ADMIN_HEADERS },
    );
  } catch (error) {
    console.error("[admin/posts/sync/apply]", error);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR" },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }
}
