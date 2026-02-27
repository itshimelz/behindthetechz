# Blog Feature Gap Roadmap

## Objective
List missing **required** features (must-have for stable production) and **possible future** features (growth roadmap) for Techzblog.

## Current Snapshot
- Core pages exist: home, blog archive, post detail, category pages, about, graph.
- Content pipeline exists from local MDX files.
- SEO base exists (`metadata`, `robots`, `sitemap`).
- Wiki-links, backlinks, and math rendering are partially implemented.

---

## Missing Required Features (High Priority)

## 1) Build Stability and Runtime Safety
- Fix syntax/runtime issues in graph UI code (`components/blog/graph-view.tsx`) before production rollout.
- Add minimal smoke checks for key routes to prevent broken deploys.
- Enforce CI pipeline: `npm run lint` + `npm run build` on every PR.

## 2) Content Validation Layer
- Add frontmatter validation (required fields, type checks, date format checks).
- Enforce slug uniqueness and reserved-path checks.
- Add validation for category/tag normalization to avoid duplicate variants.

## 3) Authoring and Publishing Workflow
- Replace placeholder sidebar categories/recent posts with dynamic data.
- Introduce clear draft/published workflow with predictable behavior in dev vs prod.
- Add content operations guide for writing, reviewing, and publishing posts.

## 4) SEO Completeness
- Add canonical URLs per post and per listing page.
- Add structured data (JSON-LD) for `BlogPosting` and `BreadcrumbList`.
- Add OG image strategy (default + per-post image handling).

## 5) Accessibility and UX Baseline
- Ensure keyboard/focus accessibility for nav, filters, and graph controls.
- Add accessible labels/alt text policy for images and icons.
- Add empty/error states for failed content reads and missing assets.

## 6) Performance and Scalability Baseline
- Add pagination or load-more behavior for `/blog` as post count grows.
- Add cache/revalidation strategy for content-heavy routes.
- Optimize expensive derived data (backlinks/graph) for larger datasets.

---

## Important But Near-Term (Should Be Next)
- Tag archive routes (`/tags/[slug]`) and tag navigation UI.
- Site search (title, excerpt, tags, category).
- RSS feed generation (`/rss.xml`).
- Better analytics hooks (page views, top posts, referral sources).
- Production-grade 404 and not-found UX for content routes.

---

## Possible Future Features (Growth Roadmap)

## A) Reader Experience
- Reading progress bar.
- Table of contents for long posts.
- Copy-link heading anchors.
- Related posts recommendations.
- Light interaction features (bookmarks, reading list).

## B) Content Intelligence
- Auto-generated summaries for posts.
- Suggested internal links while authoring.
- Tag suggestion and topic clustering.
- Content freshness scoring and stale-post reminders.

## C) Community and Distribution
- Newsletter integration.
- Webmentions/comments system.
- Social share cards and one-click share actions.
- Cross-post pipeline (e.g., Dev.to/Hashnode sync).

## D) Admin/CMS and Operations
- Internal admin panel (`/admin`) for post CRUD.
- Role-based access (author/editor/admin).
- Revision history + rollback.
- Scheduled publishing and automated revalidation.

## E) Internationalization and Language UX
- Optional bilingual metadata (Bangla + English excerpt/title).
- Reader-side translation toggle for summaries.
- Language-aware search and filters.

## F) Data Platform (When Migrating to DB)
- Prisma-based repository layer.
- Post/tag/category relational model.
- Audit log tables.
- Backup/restore playbook and migration scripts.

---

## Prioritization Suggestion
1. Stabilize build and validation (Required 1-3).
2. Complete SEO and accessibility baseline (Required 4-5).
3. Add pagination/search/tags for discoverability.
4. Add publishing/admin operations.
5. Build growth features (newsletter, analytics, recommendations).

---

## Definition of "Production-Ready" for This Blog
- Build and lint pass consistently in CI.
- New post creation does not require code changes in core UI.
- SEO metadata + sitemap + structured data are correct.
- Core routes are accessible, responsive, and resilient to missing data.
- Content can scale beyond current small post count without UX/perf degradation.
