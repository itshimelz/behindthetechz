# Blog Database Loading Plan

## Objective
Move from filesystem MDX loading (`content/posts/*.mdx`) to dynamic database-backed blog delivery while preserving current routes, SEO, and reader experience.

## Current Baseline
- Posts are parsed from MDX files via `lib/blog/get-all-posts.ts` and `lib/blog/get-post-by-slug.ts`.
- Categories/tags/graph/backlinks are derived in-memory from file content.
- Routes already map well to DB-backed queries:
  - `/blog`
  - `/blog/[slug]`
  - `/categories/[slug]`
  - `/sitemap.xml`
  - `/graph`

---

## Recommended Target Architecture
- **Database:** PostgreSQL (managed: Supabase)
- **ORM:** Prisma (already aligned with project stack)
- **Content format:** store canonical MDX body as text (`contentMdx`) in DB
- **Rendering:** keep current `next-mdx-remote/rsc` pipeline (`remark-wiki-link`, `remark-math`, `rehype-katex`, `rehype-pretty-code`)
- **Data access:** replace file readers with repository/service layer in `lib/blog/*`

---

## Data Model (Phase 1 Output)

### Core tables
- `posts`
  - `id` (uuid)
  - `slug` (unique)
  - `title`
  - `excerpt`
  - `content_mdx` (text)
  - `cover_image` (nullable)
  - `status` (`draft` | `published` | `archived`)
  - `is_featured` (boolean)
  - `published_at` (nullable)
  - `updated_at`
  - `created_at`
- `categories`
  - `id`, `name`, `slug` (unique)
- `tags`
  - `id`, `name`, `slug` (unique)
- `post_categories` (or single category FK if you want one category/post)
- `post_tags` (many-to-many)

### Optional tables
- `post_links` (source_slug, target_slug) for persisted wiki-link graph
- `post_revisions` for version history

---

## Phase-by-Phase Plan

## Phase 1 - Schema and Infrastructure

### Goal
Provision DB, define schema, and create baseline Prisma integration.

### Tasks
- Add Prisma to project and initialize schema.
- Create `Post`, `Category`, `Tag` (+ junction tables) models.
- Add indexes:
  - `posts.slug` unique
  - `posts.status, posts.published_at`
  - `categories.slug`, `tags.slug` unique
- Configure environment variables (`DATABASE_URL`, optional pooled URL).
- Run initial migration and generate Prisma client.

### Deliverables
- Working DB schema with migrations in source control.
- Type-safe Prisma client available in app.

### Definition of Done
- Prisma migration applies in local + staging.
- App can connect successfully in dev.

---

## Phase 2 - Data Migration from MDX Files

### Goal
Import existing `content/posts/*.mdx` into DB without losing metadata.

### Tasks
- Build one-time import script:
  - parse frontmatter + content
  - upsert post by slug
  - upsert categories/tags and relations
- Normalize inconsistent category language (English/Bangla) by policy.
- Map `draft` to `status=draft`, published posts to `status=published`.
- Generate migration report (imported, skipped, failed).

### Deliverables
- Seeded DB with all current blog posts.
- Repeatable import command for future bulk migrations.

### Definition of Done
- Post counts in DB match file source.
- Spot checks confirm content, tags, and slugs are intact.

---

## Phase 3 - Repository Layer and Query Replacement

### Goal
Replace file-based utilities with DB-backed query functions.

### Tasks
- Add `lib/blog/repository.ts` (or split files) with functions:
  - `getAllPosts()`
  - `getPostBySlug(slug)`
  - `getCategories()`
  - `getPostsByCategory(slug)`
  - `getTags()`
- Keep return types compatible with current UI components.
- Compute `readingTime`/`wordCount` on read or persist them in DB.
- Ensure production excludes non-published statuses.

### Deliverables
- App routes read from DB with minimal UI changes.

### Definition of Done
- `/`, `/blog`, `/blog/[slug]`, `/categories/[slug]` all render from DB.
- No regressions in metadata/sitemap generation.

---

## Phase 4 - Wiki Links, Backlinks, and Graph Support

### Goal
Keep current knowledge-graph behavior after DB migration.

### Tasks
- Continue extracting wiki links from `contentMdx` on demand, or precompute to `post_links`.
- Update `get-backlinks.ts` and `get-graph-data.ts` to use DB-sourced posts.
- Validate `/graph` rendering and link navigation behavior.
- Add guardrails for broken wiki targets (non-existing slugs).

### Deliverables
- Backlinks and graph features preserved with database content.

### Definition of Done
- Existing wiki links still resolve and graph node/link counts are correct.

---

## Phase 5 - Caching, Revalidation, and Performance

### Goal
Prevent DB pressure and keep pages fresh.

### Tasks
- Add caching strategy:
  - route segment revalidation (`revalidate`) for list pages
  - tag-based revalidation for post publish/update
- Add lightweight query optimization (select only needed fields).
- Add pagination for `/blog` as content grows.
- Add fallback behavior for transient DB errors.

### Deliverables
- Stable performance for read-heavy traffic.

### Definition of Done
- Acceptable page latency in staging.
- Revalidation updates content without full redeploy.

---

## Phase 6 - Cutover and Cleanup

### Goal
Fully switch production to DB-backed content.

### Tasks
- Remove or deprecate file-based read paths.
- Keep migration script and optional filesystem backup policy.
- Update docs and onboarding instructions.
- Add monitoring for DB/query errors.

### Deliverables
- Single source of truth: database.

### Definition of Done
- Production uses DB only.
- No required runtime dependency on `content/posts`.

---

## Verification Checklist per Phase
- `npm run lint`
- `npm run build`
- Manual checks:
  - post list ordering
  - post detail rendering (MDX + math + code blocks)
  - category filtering
  - sitemap URLs
  - graph/backlinks behavior
