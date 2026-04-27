# AGENTS.md

## Purpose

This file gives coding agents a fast, reliable way to work in this repository without breaking conventions.

## Project Snapshot

- **App name**: behind the TechZ (behindTheTechz)
- **Framework**: Next.js `16` with App Router (`app/` directory)
- **Language**: TypeScript + React `19`
- **Styling**: Tailwind CSS `v4` + `tw-animate-css` + shadcn styling (`base-nova` preset)
- **Component primitives**: `@base-ui/react` (all shadcn components use base-ui, NOT Radix)
- **Icons**: `@hugeicons/react` + `@hugeicons/core-free-icons` (do NOT use Lucide icons, which have been entirely removed)
- **Content**: DB-backed blog content in PostgreSQL (Supabase) rendered with `next-mdx-remote`
- **Package manager**: `npm` (lockfile is `package-lock.json`)
- **Linting**: `oxlint` (Primary) + `eslint`

## Repository Layout

```
app/
├── layout.tsx          # Root layout with SidebarProvider, theme hydration
├── page.tsx            # Home page
├── globals.css         # Design tokens, theme variables, prose styles
├── blog/[slug]/        # Individual blog post page (Server Component) using extracted MDX config
├── blog/               # All posts listing with search/filter
├── categories/         # Category listing and per-category pages with Suspense loading skeletons
├── graph/              # Interactive graph view of post connections
├── about/              # About page
├── changelog/          # Product updates and release notes
├── tags/               # Tag listing and per-tag pages
├── unsubscribe/        # Newsletter unsubscribe form
├── feed.xml/route.ts   # RSS feed endpoint
├── robots.ts           # SEO robots config
├── sitemap.ts          # Dynamic sitemap
components/
├── ui/                 # Reusable shadcn UI primitives (base-ui based)
├── blog/               # Blog-specific components (post-meta, code-block, graph, search, taxonomy)
├── user/               # Extracted user dialog components (author/preferences/favorites)
├── app-sidebar.tsx     # Main sidebar with nav, categories, favorites, NavUser
├── nav-user.tsx        # User profile footer with dropdown + extracted dialogs
├── nav-secondary.tsx   # Secondary nav items (About, Help)
├── site-breadcrumb.tsx # Breadcrumb navigation
├── site-footer.tsx     # Site footer
scripts/
└── backup-db-posts.mjs # DB JSON backup script
hooks/
├── use-favorites.ts    # localStorage-based favorites with cross-tab sync
├── use-theme.ts        # Theme toggle (useSyncExternalStore + MutationObserver)
├── use-mobile.ts       # Mobile detection hook
├── use-local-storage-pref.ts # Shared boolean preference hook factory
├── use-reading-progress.ts   # Reading progress preference
├── use-post-scroll-memory.ts # Per-post scroll memory preference
├── use-toc.ts                # Table of contents preference
├── use-blog-reading-preferences.ts # Blog reading surface preferences
lib/
├── utils.ts            # Shared cn() class merge helper
├── site.ts             # Canonical SITE_URL helper
├── clipboard.ts        # Shared clipboard helper with fallback
├── format-date.ts      # Shared date + relative date formatters
└── blog/               # Blog utilities (post-path, mdx-config, taxonomy-query, data fetchers, types, etc.)
```

## Runbook

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint` (runs oxlint first, then eslint)
- Build production bundle: `npm run build`
- Start production server: `npm run start`

## Code Style and Conventions

- Use TypeScript and functional React components.
- Follow existing formatting in edited files (do not reformat unrelated code).
- Keep imports grouped logically:
  1. external packages,
  2. internal aliases like `@/components/*` and `@/lib/*`.
- Reuse `cn()` from `lib/utils.ts` for class name composition.
- Keep UI component APIs consistent with existing `data-slot` and variant patterns.
- Prefer small focused changes over broad refactors.

## Icon Convention

- **Always use Hugeicons** (`@hugeicons/react` + `@hugeicons/core-free-icons`).
- Do NOT use Lucide React icons under any circumstances.
- Import pattern:
  ```tsx
  import { HugeiconsIcon } from "@hugeicons/react";
  import { SomeIcon } from "@hugeicons/core-free-icons";
  ```

## Component Primitives

- All shadcn components use `@base-ui/react` (NOT Radix UI).
- Key difference: base-ui uses `render` prop for composition instead of `asChild`.
- `DropdownMenuTrigger`, `DialogTrigger`, etc. use `render={<Component />}` pattern.
- `DropdownMenuLabel` MUST be wrapped in `DropdownMenuGroup` (base-ui requirement).

## Theme System

- Dark mode uses `.dark` CSS class on `<html>` element.
- Theme hydration via inline `<script>` in `app/layout.tsx` (reads localStorage before React hydrates).
- `useTheme()` hook from `hooks/use-theme.ts` for reactive theme state.
- Theme tokens defined in `app/globals.css` (`:root` for light, `.dark` for dark).

## Blog Content System

- Posts are stored in PostgreSQL and queried via Prisma (`lib/blog/*`).
- MDX source is `contentMdx` in DB and rendered with the existing MDX pipeline.
- MDX component map and plugin config are centralized in `lib/blog/mdx-config.tsx`.
- Blog post URL creation is centralized in `lib/blog/post-path.ts`.
- Wiki-style interlinking: `[[slug]]` syntax in MDX rendered as internal links.
- Code blocks use `rehype-pretty-code` with Shiki syntax highlighting.
- Math blocks use `remark-math` + `rehype-katex`.

## Sidebar Architecture

- `SidebarProvider` wraps the entire app in `layout.tsx`.
- Sidebar uses `collapsible="icon"` mode — collapses to icons, does NOT slide off-screen.
- Toggle button is inside the sidebar header (not in main content area).
- `NavUser` in sidebar footer with dropdown menu (theme toggle, reading preferences, favorites, author dialog).
- Category icon mapping lives in `lib/blog/category-icons.ts`.

## UI and Styling Conventions

- Prefer Tailwind utility classes over ad hoc CSS files.
- Use theme tokens from `app/globals.css` (`bg-background`, `text-foreground`, etc.) instead of hardcoded colors.
- Preserve the existing component composition style in `components/ui/*`.
- When adding interactive components, keep client/server boundaries explicit (`"use client"` only where required).

## Next.js Client/Server Boundary Rules

- Treat files in `app/*` as Server Components by default unless they start with `"use client"`.
- Make use of `loading.tsx` and `Suspense` for loading states on heavy server-rendering routes (e.g., categories, blog, graph).
- Never call functions imported from client-only modules inside Server Components.
- You may render a client component from a Server Component, but do not invoke client exports directly.
- Before finishing high-impact changes, run `npm run lint` and `npm run build` to catch errors.

## Agent Guardrails

- Do not edit generated or dependency folders (`node_modules/`, `.next/`, `out/`, `build/`).
- Do not commit secrets or `.env*` files.
- Do not upgrade major dependencies unless explicitly requested.
- Do not replace existing component libraries or architecture unless explicitly requested.
- Do not use Lucide icons — use Hugeicons.
- Do not use Radix UI directly — use base-ui via shadcn components.

## Change Workflow for Agents

1. Read relevant files before editing to match local conventions.
2. Make the smallest change that satisfies the task.
3. Run `npm run lint` after code changes when feasible.
4. Run `npm run build` for high-impact changes (routing, layout, config, or shared UI).
5. In your final note, list changed files and any verification commands executed.
