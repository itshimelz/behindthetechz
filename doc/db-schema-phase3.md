# Phase 3 — Database Schema Changes

This document describes the database schema changes introduced for **Post Series** and **View Count** features. Use this as reference when updating the CLI for CRUD operations.

---

## Migration: `add_series_and_view_count`

### New Table: `series`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `UUID` | No | `gen_random_uuid()` | Primary key |
| `name` | `TEXT` | No | — | Display name (e.g., "Kotlin Multiplatform from Scratch") |
| `slug` | `TEXT` | No | — | URL-safe identifier, `UNIQUE` |
| `description` | `TEXT` | Yes | `NULL` | Optional description of the series |
| `created_at` | `TIMESTAMPTZ` | No | `now()` | Auto-set on creation |
| `updated_at` | `TIMESTAMPTZ` | No | `now()` | Auto-updated via Prisma `@updatedAt` |

### Modified Table: `posts`

New columns added:

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `view_count` | `INTEGER` | No | `0` | Incremented via `POST /api/posts/{slug}/views` |
| `series_id` | `UUID` | Yes | `NULL` | FK → `series.id`, ON DELETE SET NULL |
| `series_order` | `INTEGER` | Yes | `NULL` | Position within the series (1-based) |

### New Indexes

| Name | Table | Columns |
|------|-------|---------|
| `posts_series_id_idx` | `posts` | `series_id` |

---

## SQL Migration

```sql
-- Create series table
CREATE TABLE IF NOT EXISTS "series" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "series_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "series_slug_key" UNIQUE ("slug")
);

-- Add new columns to posts
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "view_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "series_id" UUID;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "series_order" INTEGER;

-- Foreign key
ALTER TABLE "posts"
  ADD CONSTRAINT "posts_series_id_fkey"
  FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE SET NULL;

-- Index
CREATE INDEX IF NOT EXISTS "posts_series_id_idx" ON "posts"("series_id");
```

---

## CLI CRUD Operations Reference

### Series CRUD

| Operation | Endpoint / Query | Notes |
|-----------|-----------------|-------|
| **Create** series | `INSERT INTO series (name, slug, description) VALUES (...)` | Auto-generates UUID id |
| **List** all series | `SELECT * FROM series ORDER BY name` | Include `_count` of posts if needed |
| **Get** series by slug | `SELECT * FROM series WHERE slug = $1` | |
| **Update** series | `UPDATE series SET name = $1, slug = $2, description = $3, updated_at = now() WHERE id = $4` | |
| **Delete** series | `DELETE FROM series WHERE id = $1` | Posts will have `series_id` set to NULL (ON DELETE SET NULL) |

### Assigning Posts to Series

| Operation | Query | Notes |
|-----------|-------|-------|
| **Assign** post to series | `UPDATE posts SET series_id = $1, series_order = $2 WHERE slug = $3` | Set both series_id and order |
| **Remove** from series | `UPDATE posts SET series_id = NULL, series_order = NULL WHERE slug = $1` | |
| **Reorder** in series | `UPDATE posts SET series_order = $1 WHERE id = $2` | Update order for each post |
| **List** posts in series | `SELECT slug, title, series_order FROM posts WHERE series_id = $1 ORDER BY series_order ASC` | |

### View Count

| Operation | Query / API | Notes |
|-----------|------------|-------|
| **Increment** | `POST /api/posts/{slug}/views` → returns `{ viewCount }` | Called by browser on page load |
| **Get** count | `GET /api/posts/{slug}/views` → returns `{ viewCount }` | |
| **Reset** count | `UPDATE posts SET view_count = 0 WHERE slug = $1` | Admin only |
| **Bulk read** | `SELECT slug, view_count FROM posts ORDER BY view_count DESC` | For "most popular" |

---

## Prisma Schema Snippet

```prisma
model Post {
  // ... existing fields ...
  viewCount   Int      @default(0) @map("view_count")
  seriesId    String?  @map("series_id") @db.Uuid
  seriesOrder Int?     @map("series_order")
  series      Series?  @relation(fields: [seriesId], references: [id])

  @@index([seriesId], map: "posts_series_id_idx")
}

model Series {
  id          String   @id @default(uuid()) @db.Uuid
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  posts       Post[]

  @@map("series")
}
```

## Applying the Migration

Run from the project root:

```bash
# Option 1: Prisma migrate (requires shadow database access)
npx prisma migrate dev --name add_series_and_view_count

# Option 2: Direct push (no shadow database needed)
npx prisma db push

# Option 3: Run the SQL manually in Supabase SQL Editor
# (copy the SQL from the "SQL Migration" section above)

# After migration, regenerate Prisma client:
npx prisma generate
```
