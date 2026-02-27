# Techzblog Conversion Plan

## Objective
Convert the current project into a personal blog platform while preserving:

- The existing Next.js App Router architecture
- The current shadcn/base-nova visual language
- Existing component structure (`components/ui/*`, feature components, `lib/*` utilities)
- Existing project conventions in `AGENTS.md`

This plan is phased so implementation can be shipped incrementally without breaking the current app.

---

## Current Project Baseline

### Stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/base-nova
- Hugeicons icon stack

### Existing patterns to keep
- Route-first architecture in `app/*`
- Reusable primitives in `components/ui/*`
- Utility-first styling with theme tokens in `app/globals.css`
- Sidebar layout system from `sidebar-10` block

### Current routes
- `/` (home)
- `/journal` (current content view)
- `/dashboard` (shadcn block scaffold)

---

## Target Information Architecture

### Public routes
- `/` - Blog home (hero + featured + latest)
- `/blog` - All posts archive
- `/blog/[slug]` - Individual article page
- `/categories/[slug]` - Category archive
- `/about` - Author/profile page

### Optional routes
- `/tags/[slug]` - Tag archive
- `/rss.xml` - RSS feed
- `/search` - Full search page

---

## Content Model

### Recommended source
MDX files stored in the repo for simplicity and portability.

### Directory structure
```txt
content/
  posts/
    my-first-post.mdx
    ai-and-writing.mdx
```

### Frontmatter schema (minimum)
```yaml
title: ""
slug: ""
excerpt: ""
date: "2026-02-27"
updatedAt: "2026-02-27"
coverImage: "/images/post-cover.jpg"
category: "engineering"
tags: ["nextjs", "typescript"]
featured: false
draft: false
```

### Derived metadata
- reading time
- word count
- canonical URL
- OpenGraph/Twitter payload

---

## Phased Implementation Plan

## Phase 1 - Foundation and Route Strategy

### Goal
Prepare stable blog route skeletons and remove demo-oriented intent.

### Tasks
- Keep existing theme and typography setup intact.
- Establish route files:
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/categories/[slug]/page.tsx`
  - `app/about/page.tsx`
- Update home page (`app/page.tsx`) to blog-oriented entry.
- Decide what to do with `/journal` and `/dashboard`:
  - keep temporarily as staging,
  - or migrate and deprecate.

### Deliverables
- Navigable route skeletons with placeholder data.
- Clear top-level navigation for blog users.

### Definition of Done
- All new routes compile.
- No server/client boundary issues.
- Lint/build pass.

---

## Phase 2 - Content Layer (MDX + Typed Utilities)

### Goal
Introduce a typed content pipeline from local MDX files.

### Tasks
- Add content directories:
  - `content/posts/*`
- Create typed helpers in `lib/blog/`:
  - `types.ts` (frontmatter + post types)
  - `get-all-posts.ts`
  - `get-post-by-slug.ts`
  - `get-categories.ts`
  - `get-tags.ts`
- Implement slug normalization and sorting by date.
- Add draft filtering behavior (exclude in prod, optional include in dev).

### Deliverables
- Typed post querying from local files.
- Deterministic sorting/filtering for posts, tags, categories.

### Definition of Done
- Content functions return stable typed outputs.
- Missing fields fail fast with clear errors.
- Lint/build pass.

---

## Phase 3 - Reusable Blog Components

### Goal
Create reusable blog UI using existing shadcn style conventions.

### Tasks
- Build feature components in `components/blog/`:
  - `post-card.tsx`
  - `post-list.tsx`
  - `post-meta.tsx`
  - `tag-pill.tsx`
  - `category-nav.tsx`
  - `empty-state.tsx`
- Use existing `components/ui/*` primitives first.
- Only add new shadcn components if required by design needs.

### Deliverables
- Blog UI primitives that can be reused across home/archive/detail pages.

### Definition of Done
- Components are stateless or clearly typed.
- Style consistency with existing tokens/components.
- Lint/build pass.

---

## Phase 4 - Page Assembly

### Goal
Wire real content into all target routes.

### Tasks
- Home page:
  - hero/intro,
  - featured posts,
  - latest posts,
  - optional category quick links.
- Blog archive page:
  - all posts list,
  - optional pagination or infinite list.
- Post detail page:
  - rendered MDX,
  - title/excerpt/date/category/tags,
  - related posts section.
- Category page:
  - filtered list by category.
- About page:
  - author bio and links.

### Deliverables
- End-to-end public blog experience.

### Definition of Done
- Every page uses real content utilities.
- No broken internal links.
- Lint/build pass.

---

## Phase 5 - SEO, Discovery, and Sharing

### Goal
Make content discoverable and socially shareable.

### Tasks
- Replace default app metadata in `app/layout.tsx`.
- Add dynamic metadata in post routes.
- Add:
  - `app/sitemap.ts`
  - `app/robots.ts`
- Add canonical URL handling.
- Add social metadata fields (OG/Twitter).
- (Optional) Add RSS feed.

### Deliverables
- Search-engine ready blog pages.
- Rich social previews for posts.

### Definition of Done
- Metadata appears correctly per route.
- Sitemap/robots generate correctly.
- Lint/build pass.

---

## Phase 6 - UX Enhancements

### Goal
Improve browsing and reading experience without changing core design language.

### Tasks
- Add client-side search/filter for titles/tags/categories.
- Add reading progress indicator (optional).
- Add table of contents for long posts (optional).
- Improve mobile sidebar/nav behavior.
- Add empty/loading states.

### Deliverables
- Smoother user journey for content-heavy usage.

### Definition of Done
- Search/filter works on production data.
- Mobile layout is readable and functional.
- Lint/build pass.

---

## Phase 7 - Content Operations and Publishing Workflow

### Goal
Make publishing simple and repeatable.

### Tasks
- Define author workflow:
  - create MDX,
  - add frontmatter,
  - add cover image,
  - preview locally,
  - publish.
- Add validation checklist for new posts.
- Add docs for image sizing and naming conventions.
- Add optional pre-commit/frontmatter validation scripts.

### Deliverables
- Team/self-service content workflow documentation.

### Definition of Done
- New posts can be added without code changes.
- Content quality checks are documented and repeatable.

---

## Suggested File Map (Target)

```txt
app/
  page.tsx
  blog/
    page.tsx
    [slug]/
      page.tsx
  categories/
    [slug]/
      page.tsx
  about/
    page.tsx
  sitemap.ts
  robots.ts

components/
  blog/
    post-card.tsx
    post-list.tsx
    post-meta.tsx
    tag-pill.tsx
    category-nav.tsx

content/
  posts/
    *.mdx

lib/
  blog/
    types.ts
    get-all-posts.ts
    get-post-by-slug.ts
    get-categories.ts
    get-tags.ts
```

---

## Risks and Mitigations

### Risk: Server/Client boundary errors in App Router
Mitigation:
- Keep content utilities server-safe.
- Do not call client module exports in server routes.
- Run `npm run lint` and `npm run build` after route-level changes.

### Risk: Inconsistent frontmatter across posts
Mitigation:
- Centralize schema typing/validation in `lib/blog/types.ts`.
- Fail early with clear author-facing errors.

### Risk: Visual inconsistency from one-off styles
Mitigation:
- Reuse shadcn components and theme tokens.
- Avoid custom color systems unless explicitly needed.

---

## Milestone Checklist

- [ ] Phase 1 complete: route skeletons + blog nav
- [ ] Phase 2 complete: MDX typed content layer
- [ ] Phase 3 complete: reusable blog components
- [ ] Phase 4 complete: assembled pages with real content
- [ ] Phase 5 complete: SEO/sitemap/robots
- [ ] Phase 6 complete: search + UX enhancements
- [ ] Phase 7 complete: publishing workflow docs

---

## Execution Order Recommendation
Implement Phases 1-4 first for a usable blog MVP, then Phase 5 (SEO), then Phase 6-7 for polish and operations.
