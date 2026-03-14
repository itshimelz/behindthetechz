# Post Footer UX Redesign Plan

## Goal
Make the post footer area richer and more engaging. Three improvements: **Engagement Bar Redesign**, **Tags Section Polish**, **Newsletter CTA**.

## Current State
After the MDX prose content, the article contains:
1. `BacklinksSection` (conditional) — wiki-style "Linked from" pills
2. `RelatedPosts` — 2-3 column card grid
3. `PostFooter` — clap+views row, category·date line, tag pills

**Problems:**
- Footer feels flat/utilitarian — just metadata dumped at the bottom
- Share & Favorite buttons only exist in the header (scrolled far away by reading end)
- "Thanks for reading" text is passive; no call-to-action
- Tags are generic outline badges with no visual context
- No newsletter/subscribe CTA anywhere

## New Section Order (after prose)
```
BacklinksSection (unchanged, conditional)
   ↓
PostFooter (REDESIGNED as engagement bar)
   ↓
PostTags (NEW extracted component, polished)
   ↓
NewsletterCTA (NEW component)
   ↓
RelatedPosts (unchanged)
   ↓
PostMeta line (category · date, moved to very bottom)
```

---

## Changes By File

### 1. `components/blog/post-footer.tsx` — MAJOR REWRITE

**Remove:** tags, category, date rendering. Remove `tags`, `category`, `date` props.
**Add:** `title` prop (for share/favorite). Add Share, Favorite, Copy Link buttons.
**Keep:** All clap logic (state, optimistic updates, Framer Motion animations), view count fetching.

**New props:**
```ts
type Props = {
  slug: string;
  title: string;        // NEW — needed for share/favorite
  initialClapCount?: number;
  initialViewCount?: number;
};
```

**New layout:**
```
┌──────────────────────────────────────────────────┐
│ border-t divider                                  │
│                                                   │
│  [👏 8] | [👁 5 views]          [📋] [↗] [🔖]   │
│  ← left group                  right group →      │
│                                                   │
└──────────────────────────────────────────────────┘
```

- Left group: Clap button (pill shape with `rounded-full px-3 py-1.5 hover:bg-muted`) + animated count, vertical `|` divider, eye icon + view count
- Right group: Copy link button, ShareButton (reuse existing component), Bookmark toggle (inline, using `useFavorites` hook directly)
- Each action button: `rounded-full p-2 hover:bg-muted` for consistent hit targets
- Wrap clap/bookmark in Tooltip for accessibility
- Remove "Thanks for reading" text (newsletter CTA replaces this)

**Imports to add:**
- `Share08Icon`, `Bookmark02Icon`, `Copy01Icon`, `Tick02Icon` from hugeicons
- `useFavorites` from hooks
- `Tooltip`, `TooltipContent`, `TooltipTrigger` from ui
- `ShareButton` from blog (reuse existing share dialog component)

**Imports to remove:**
- `Link` from next/link (no longer linking to category)
- `Badge` from ui (tags moved out)

### 2. `components/blog/post-tags.tsx` — NEW FILE

Extracted tags section with polished visual treatment.

**Props:**
```ts
type Props = {
  tags: string[];
  category: string;
  date: string;
};
```

**Layout:**
```
┌──────────────────────────────────────────────────┐
│                                                   │
│  🏷 Tags ─────────────────────────────────────   │
│                                                   │
│  [ web ]  [ performance ]  [ wasm ]  [ rust ]    │
│                                                   │
│  Programming  ·  Mar 5, 2026                      │
│                                                   │
└──────────────────────────────────────────────────┘
```

- "Tags" label with `Tag01Icon` + horizontal rule extending right (labeled divider pattern)
- Tags use `Badge variant="outline"` with softer hover: `hover:bg-primary/10 hover:text-primary hover:border-primary/30` (instead of hard bg-primary swap)
- Category link + formatted date on a subtle meta line below
- Whole section wrapped in `mx-auto w-full max-w-3xl` container
- Server Component (no `"use client"` needed)

### 3. `components/blog/newsletter-cta.tsx` — NEW FILE

Newsletter subscribe card. Client component for form interaction.

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  border rounded-xl bg-muted/30 p-6               │
│                                                   │
│  ✉ Enjoyed this article?                         │
│  Get notified when new posts about                │
│  Programming are published.                       │
│                                                   │
│  ┌─────────────────────────────┐ ┌───────────┐   │
│  │  your@email.com             │ │ Subscribe  │   │
│  └─────────────────────────────┘ └───────────┘   │
│                                                   │
│  No spam. Unsubscribe anytime.                    │
└──────────────────────────────────────────────────┘
```

**Props:**
```ts
type Props = {
  category: string;
};
```

**Design:**
- Card container: `border border-border/50 rounded-xl bg-muted/20 dark:bg-muted/10 p-6`
- Heading: `text-lg font-semibold` "Enjoyed this article?"
- Description: `text-sm text-muted-foreground` with category name highlighted
- Form row: `flex gap-2` with `Input` (email type, placeholder) + `Button` (default variant, "Subscribe")
- Disclaimer: `text-xs text-muted-foreground` "No spam. Unsubscribe anytime."
- Width: `mx-auto w-full max-w-3xl`
- **Visual-only for now** — form submits to nothing, shows a success toast via `sonner` on submit
- Uses existing `Input` from `@/components/ui/input` and `Button` from `@/components/ui/button`
- Import `Mail01Icon` from hugeicons for the envelope icon

### 4. `app/blog/[slug]/page.tsx` — EDIT (section reordering + new imports)

**Changes:**
1. Add imports: `PostTags`, `NewsletterCTA`
2. Reorder post footer sections (lines ~280-294):

**Before:**
```tsx
<BacklinksSection backlinks={backlinks} />
<RelatedPosts posts={relatedPosts} />
<PostFooter slug={post.slug} tags={post.tags} category={post.category} date={post.date} ... />
```

**After:**
```tsx
<BacklinksSection backlinks={backlinks} />
<PostFooter slug={post.slug} title={post.title} initialClapCount={post.clapCount} initialViewCount={post.viewCount} />
<PostTags tags={post.tags} category={post.category} date={post.date} />
<NewsletterCTA category={post.category} />
<RelatedPosts posts={relatedPosts} />
```

3. Update `PostFooter` props: remove `tags`, `category`, `date`; add `title`

---

## Files Summary

| File | Action | Component Type |
|------|--------|---------------|
| `components/blog/post-footer.tsx` | Rewrite | Client (clap state, favorites, copy) |
| `components/blog/post-tags.tsx` | Create | Server (static rendering) |
| `components/blog/newsletter-cta.tsx` | Create | Client (form state, toast) |
| `app/blog/[slug]/page.tsx` | Edit | Server (import + reorder) |

## Verification
- `npm run lint`
- `npm run build`
- Visual testing in browser (dark + light mode) on `/blog/rust-to-wasm-production-guide`
