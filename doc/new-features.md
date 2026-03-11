# New Features Documentation

Documentation for all features added on March 11, 2026.

---

## 1. Reading Time on Post Cards

Reading time (`X min read`) is now displayed alongside the date on all post cards — both in the blog listing (`/blog`) and on the homepage "Recent Writings" section.

**Files**: `components/blog/post-card.tsx`, `app/page.tsx`

---

## 2. "Last Updated" Badge

Posts that have been significantly updated (>24h after initial publish) display an "Updated X days ago" badge with a tooltip showing the exact date.

**Files**: `components/blog/post-meta.tsx`

---

## 3. Copy Post Link

A link-copy icon appears on hover over each post card. Clicking it copies the post URL to clipboard and shows a toast notification.

**Files**: `components/blog/post-card.tsx` (now a client component)

---

## 4. RSS Feed

Available at `/feed.xml`. RSS 2.0 format with auto-discovery via `<link>` tag in the root layout.

**Files**: `app/feed.xml/route.ts`, `app/layout.tsx`

---

## 5. Tags Page

Browse all tags at `/tags` with color-coded badges. Each tag links to `/tags/{slug}` showing filtered posts.

**Files**: `app/tags/page.tsx`, `app/tags/[slug]/page.tsx`, `app/tags/loading.tsx`, `lib/blog/get-tags.ts` (added `getPostsByTag`), `lib/utils.ts` (added `getTagColorClass`)

**Sidebar**: Added "Tags" nav item in `app-sidebar.tsx`

---

## 6. Table of Contents

Posts with 2+ headings display a navigable Table of Contents. Collapsible on mobile, always visible on desktop. Active heading highlighted via IntersectionObserver.

**Files**: `components/blog/table-of-contents.tsx`, `app/blog/[slug]/page.tsx`

---

## 7. Related Posts

Up to 3 related posts shown at the bottom of each blog post. Related posts are determined by shared tags and category, ranked by relevance.

**Files**: `lib/blog/get-related-posts.ts`, `components/blog/related-posts.tsx`, `app/blog/[slug]/page.tsx`

---

## 8. Changelog Page

Available at `/changelog`. Content is read from `content/CHANGELOG.md` and rendered as MDX. Add new entries to the markdown file to update the changelog.

**Files**: `app/changelog/page.tsx`, `content/CHANGELOG.md`

**Sidebar**: Added "What's New" nav item in `app-sidebar.tsx`

---

## 9. Post Series (Requires DB Migration)

Group posts into ordered series. When a post belongs to a series, a navigation bar shows all parts with prev/next links.

**DB Changes**: New `series` table + `series_id`, `series_order` columns on `posts`. See `doc/db-schema-phase3.md` for details.

**Files**: `prisma/schema.prisma`, `lib/blog/get-series.ts`, `components/blog/series-nav.tsx`, `app/blog/[slug]/page.tsx`

---

## 10. View Count (Requires DB Migration)

Each post tracks and displays view counts. Incremented automatically when a reader opens a post.

**DB Changes**: New `view_count` column on `posts`. See `doc/db-schema-phase3.md` for details.

**API**: `POST /api/posts/{slug}/views` (increment), `GET /api/posts/{slug}/views` (read)

**Files**: `app/api/posts/[slug]/views/route.ts`, `components/blog/view-counter.tsx`, `components/blog/post-meta.tsx`

---

## Migration Required

Features 9 and 10 require a database migration before they will work. Run:

```bash
# Apply the schema to the database
npx prisma db push

# Regenerate Prisma client
npx prisma generate
```

Or apply the SQL manually from `doc/db-schema-phase3.md`.
