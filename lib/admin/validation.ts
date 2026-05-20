import { z } from "zod";

// ---------------------------------------------------------------------------
// Post CRUD Schemas
// ---------------------------------------------------------------------------

export const createPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be ≤ 200 characters"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be ≤ 500 characters"),
  excerpt: z.string().min(1, "Excerpt is required"),
  contentMdx: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  coverImage: z.string().url("Must be a valid URL").nullable().optional(),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
  categories: z.array(z.string()).optional(), // category slugs
  tags: z.array(z.string()).optional(), // tag slugs
  series: z.string().nullable().optional(), // series slug
  seriesOrder: z.number().int().positive().nullable().optional(),
});

export const updatePostSchema = createPostSchema.partial().omit({ slug: true });

/** Body for `POST .../publish` when the post does not exist yet (slug comes from the URL). */
export const publishCreatePostSchema = createPostSchema.omit({ slug: true });

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishCreatePostInput = z.infer<typeof publishCreatePostSchema>;

// ---------------------------------------------------------------------------
// Sync Schemas
// ---------------------------------------------------------------------------

export const syncManifestSchema = z.object({
  manifest: z.array(
    z.object({
      slug: z.string().min(1),
      contentHash: z.string().min(1),
      updatedAt: z.string().datetime().nullable(),
    }),
  ),
});

export const syncApplySchema = z.object({
  operations: z.array(
    z.object({
      action: z.enum(["create", "update", "delete"]),
      slug: z.string().min(1),
      data: createPostSchema.omit({ slug: true }).partial().optional(),
    }),
  ),
});

export type SyncManifestInput = z.infer<typeof syncManifestSchema>;
export type SyncApplyInput = z.infer<typeof syncApplySchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format Zod errors into a CLI-friendly structure.
 */
export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}
