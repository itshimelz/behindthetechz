# Post Series Feature Documentation

## Overview

The Post Series feature lets you group related blog posts into an ordered sequence.

When a post is part of a series:
- A series navigation panel is shown on the post page.
- Readers can see all parts in order.
- Readers can jump to previous/next parts.

This feature is database-backed and works with the admin sync API.

## Data Model

The feature uses:
- A `series` table for series metadata.
- Two optional columns on `posts`:
  - `series_id` (foreign key to `series.id`)
  - `series_order` (1-based order inside a series)

Current Prisma models are defined in:
- `prisma/schema.prisma`

Core relations:
- `Post.seriesId -> Series.id`
- `Post.seriesOrder` stores the sequence position.

## Runtime Flow

### 1. Post loading

On blog post pages, the app checks whether the current post has a `seriesId`.

If yes, it loads the series and all published posts in that series, ordered by `seriesOrder`.

Implementation:
- `app/blog/[slug]/page.tsx`
- `lib/blog/get-series.ts`

### 2. Series query and caching

Series data is fetched via Prisma and cached with `unstable_cache`.

Key behavior:
- Uses 300-second revalidation.
- Tags with `blog:posts` for invalidation.
- Returns published posts only (same status filter used by blog post listing).

Implementation:
- `lib/blog/get-series.ts`
- `lib/blog/get-all-posts.ts`

### 3. UI rendering

If series data exists, `SeriesNav` renders:
- Series name
- Current part number
- Ordered list of parts
- Previous/Next links

Implementation:
- `components/blog/series-nav.tsx`

## Admin/Sync API Support

The sync apply endpoint supports series assignment during create and update:
- `series` (slug)
- `seriesOrder` (positive integer)

Validation:
- `lib/admin/validation.ts`

Apply logic:
- Create: connects to series by slug when provided.
- Update: supports connect/disconnect for `series`, and set/clear for `seriesOrder`.

Implementation:
- `app/api/admin/posts/sync/apply/route.ts`

## How To Use

### Step 1: Create a series record

Create a row in `series` first.

Example SQL:

```sql
INSERT INTO series (id, name, slug, description)
VALUES (
  gen_random_uuid(),
  'Kotlin Multiplatform from Scratch',
  'kmp-from-scratch',
  'A complete guide to learning Kotlin Multiplatform.'
);
```

### Step 2: Assign posts to the series

Option A (content sync / frontmatter-driven flow):
- Include `series` and `seriesOrder` in post data.

Option B (direct DB update):

```sql
UPDATE posts
SET
  series_id = (SELECT id FROM series WHERE slug = 'kmp-from-scratch'),
  series_order = 1
WHERE slug = 'intro-to-kmp';
```

### Step 3: Verify in UI

Open the post page and confirm the series navigation appears above the article body.

## Constraints and Notes

- `seriesOrder` should be unique per series for a clean reading order.
- The current implementation does not enforce uniqueness at DB level.
- Series navigation is only shown when `seriesId` is present and the series exists.
- Ordering depends on `seriesOrder`; null or duplicate values can produce confusing order.
- If a connected series slug does not exist, write operations will fail due to relation constraints.

## Troubleshooting

### Series navigation not showing

Check:
- The post has non-null `series_id`.
- The referenced series exists.
- The post is visible under current status filtering.

### Wrong order in series

Check:
- `series_order` values are set and consistent.
- No duplicates inside the same series.

### Sync apply fails on series connect

Check:
- Payload `series` value matches an existing `series.slug`.
- Input passes schema validation (`seriesOrder` must be a positive integer when provided).

## Related Documentation

- `docs/post-authoring-guide.md` (author workflow including series frontmatter)
- `doc/db-schema-phase3.md` (detailed migration and schema SQL)
- `doc/new-features.md` (feature summary)
