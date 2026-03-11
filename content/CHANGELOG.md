# Changelog

All notable changes to **behind the TechZ** will be documented here.

---

## March 11, 2026

### ✨ New Features
- **Table of Contents** — Posts with multiple headings now show a navigable ToC with active section highlighting
- **Related Posts** — Each post now suggests up to 3 related articles based on shared tags and categories
- **Tags Page** — Browse all tags at `/tags` and view posts per tag at `/tags/{slug}` with color-coded badges
- **RSS Feed** — Subscribe to the blog via RSS at `/feed.xml`
- **Post Series** — Group related posts into ordered series with in-post navigation (supported in both web and CLI)
- **View Count** — Posts now display view counts, tracked per visit
- **Changelog Page** — You're reading it right now!
- **CLI Image Uploading** — Batch upload local images directly to Supabase via the CLI using `techz image upload`

### 🎨 Improvements
- Reading time now shown on all post cards (blog listing + homepage)
- Date and reading time displayed in italic for a cleaner look
- "Last Updated" badge appears on posts significantly updated after initial publish
- Copy post link button (hover) on post cards for quick sharing
- **TOC Redesign** — Added a sleek visual hierarchy for Desktop TOCs with circular navigation arrows and precise active-state tracking
- **Mobile TOC UX** — Replaced inline TOC with a persistent floating pill button that opens a smooth bottom-sheet overlay
- **Related Posts Design** — Improved presentation using edge-to-edge images and aesthetic placeholders for visually consistent cards
- **Adjusted Typography** — Tweaked blog post line gaps for enhanced readability on large screens
- **Custom Favicon** — Updated the site's default favicon

### 🐛 Bug Fixes
- **TOC Scroll Bug** — Fixed an issue where clicking TOC links wouldn't scroll accurately due to sticky headers
- **CLI Upload Bug** — Fixed `INVALID_FORM_DATA` parsing errors for multipart image uploads in the Next.js App Router
- **Sync Route** — Resolved `revalidateTag` expected argument error in the admin post sync route

---

## February 2026

### 🚀 Launch
- Initial launch of **behind the TechZ**
- Blog with MDX content, categories, tags, and graph view
- Dark/light theme with localStorage persistence
- Favorites system with cross-tab sync
- Share dialog with X, Facebook, LinkedIn, WhatsApp, Telegram, and Email
- Wiki-style `[[slug]]` interlinking with backlinks
- Reading progress bar and scroll-to-top
- SEO: Open Graph, Twitter cards, sitemap, robots.txt
