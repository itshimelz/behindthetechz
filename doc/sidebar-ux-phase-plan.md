# Sidebar UX Improvement Plan

This document breaks the sidebar improvements into practical implementation phases so the work can be shipped safely without disrupting existing navigation.

---

## Goals

- Make the sidebar easier to scan on desktop
- Make the mobile drawer feel intentional and compact
- Reduce cognitive load by prioritizing common reader actions
- Improve orientation with stronger active states and clearer grouping
- Simplify settings/profile behavior for a content-first website

---

## Phase 1 - Mobile Foundation [COMPLETED]

Focus on making the current sidebar usable on smaller screens before changing structure.

### Changes

- [x] Reduce visual density in the mobile sheet and tighten section spacing
- [x] Add safe-area padding for mobile devices with notches
- [x] Add `overscroll-behavior: contain` to the mobile sidebar sheet
- [x] Close the mobile drawer immediately after link selection
- [x] Default collapsible groups to closed on mobile
- [x] Shorten the header presentation on mobile so the brand row takes less space

### Files

- `components/ui/sidebar.tsx`
- `components/app-sidebar.tsx`
- `components/nav-secondary.tsx`

### Implementation Notes

- Mobile sheet width reduced from `18rem` to `17rem` for a tighter feel
- `SidebarHeader`, `SidebarGroup`, and `SidebarContent` apply tighter padding/gaps when `isMobile` is true
- `closeMobileDrawer` callback wired to every link (`navMain`, categories, favorites, recent posts, secondary nav)
- All three `Collapsible` sections use `defaultOpen={!isMobile}` so they start collapsed on phones
- Brand row uses `text-base` instead of `text-lg` on mobile; `SidebarTrigger` hidden on mobile since the sheet has its own close mechanism
- Safe-area insets applied via `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`

---

## Phase 2 - Navigation Hierarchy [COMPLETED]

Reorganize the sidebar around reader intent instead of equal-weight sections.

### Changes

- [x] Keep primary navigation at the top
- [x] Move `Favorites` above `Categories` and `Recent Posts`
- [x] Group `All Posts`, `Categories`, `Tags`, and `Graph View` under a clearer browsing structure if needed
- [x] Move `What's New`, `About`, and `Help` into a lower-emphasis utility area
- [x] Add a visible section label above utility links

### Proposed Order

1. Main navigation
2. Favorites
3. Recent posts
4. Top categories
5. Utility links
6. Preferences / author footer

### Files

- `components/app-sidebar.tsx`
- `components/nav-secondary.tsx`

### Implementation Notes

- Reordered sidebar sections in `app-sidebar.tsx` to match the proposed order: Main navigation -> Favorites -> Recent Posts -> Top Categories -> Utility links (NavSecondary with `mt-auto`) -> Preferences/author footer (NavUser)
- Added numbered section comment markers (`{/* 1. Main navigation */}`, etc.) for maintainability
- Added `SidebarGroupLabel` with text "More" above utility links in `NavSecondary` — this label auto-hides in collapsed icon mode via the existing `group-data-[collapsible=icon]:opacity-0` styles
- Verified with `npm run lint` (0 errors, only pre-existing unrelated TanStack Table warning) and `npm run build` (compiled and generated all pages successfully)

### Expected Outcome

- The sidebar matches how readers actually move through the site
- Important actions become easier to find at a glance

---

## Phase 3 - Active State and Orientation [COMPLETED]

Strengthen wayfinding so users always know where they are.

### Changes

- [x] Add active-state styling for secondary links
- [x] Add active-state styling for category links
- [x] Add active-state styling for favorite links when the current slug matches
- [x] Add active-state styling for recent post links when the current slug matches
- [x] Improve collapsed sidebar tooltips so icon mode remains understandable

### Files

- `components/app-sidebar.tsx`
- `components/nav-secondary.tsx`
- `components/ui/sidebar.tsx`

### Implementation Notes

- `NavSecondary` now uses `usePathname` and passes `isActive` to each `SidebarMenuButton`
- Category links match against `/categories/{slug}` path
- Favorites and recent post links match against a memoized `activeBlogSlug` extracted from the current pathname
- `SidebarMenuButton` tooltip in `sidebar.tsx` now renders a `sidebar-primary` colored dot prefix when `isActive` is true, giving collapsed icon-mode users a visual active indicator

---

## Phase 4 - Content Density and Scannability [COMPLETED]

Reduce long unstructured lists and make sidebar content more informative.

### Changes

- [x] Limit visible recent posts to a smaller curated set
- [x] Limit visible favorites to a compact preview list with overflow handled elsewhere
- [x] Add `View all` links for favorites or archive destinations where appropriate
- [x] Add lightweight metadata where helpful, such as date or reading time for recent posts
- [x] Rename `Categories` to `Top Categories` if only a subset is shown

### Files

- `components/app-sidebar.tsx`
- `lib/blog/get-all-posts.ts`

### Implementation Notes

- **Data layer**: Expanded `getRecentPostLinks` Prisma query to also select `publishedAt`; updated `RecentPostLink` type to include `publishedAt: Date | null`
- **Recent posts**: Each item now shows a compact relative date (e.g. "2d", "3w", "Jan 5") right-aligned in `text-[10px]` muted text; `relativeDate()` helper added to `app-sidebar.tsx`
- **Favorites**: Limited inline display to 5 items (`SIDEBAR_FAVORITES_LIMIT`); when there are more, a "+N more" overflow link appears at the bottom — full list remains accessible via the favorites dialog in `NavUser`
- **View all links**: Added `SidebarGroupAction` with an arrow icon to both "Recent Posts" (→ `/blog`) and "Top Categories" (→ `/categories`) section headers; these auto-hide in collapsed icon mode
- **Label rename**: "Categories" section label changed to "Top Categories" since only the top 5 are displayed
- `nav-user.tsx` was not modified — the favorites dialog there already handles the full list
- Verified with `npm run lint` (0 errors) and `npm run build` (compiled and generated all pages successfully)

### Expected Outcome

- Less clutter in the sidebar
- Faster scanning with more useful context per row

---

## Phase 5 - Footer and Preferences Simplification [COMPLETED]

Make the bottom of the sidebar feel less like an account menu and more like reader preferences.

### Changes

- [x] Rename the footer trigger from a profile-style control to a preferences-style control
- [x] Surface theme toggle more directly
- [x] Separate author information from reading preferences
- [x] Decide on one primary entry point for favorites to avoid duplication
- [x] Reduce menu depth for common actions

### Files

- `components/nav-user.tsx`

### Implementation Notes

- **Footer trigger redesigned**: Removed the large avatar/email/up-down-arrow profile-style trigger entirely. The footer now contains two simple `SidebarMenuButton` items instead of a single account-style button.
- **Theme toggle surfaced directly**: First footer item is a standalone `SidebarMenuButton` showing sun/moon icon + "Light Mode"/"Dark Mode" label — clickable directly without opening any dropdown, making the most common preference a single click.
- **Preferences dropdown simplified**: Second footer item is a `SidebarMenuButton` with `Settings01Icon` + "Preferences" label. Its dropdown contains: "Reading Preferences" (dialog), "All Favorites" (dialog), separator, "About Author" (dialog).
- **Author info separated from reading preferences**: The old single dialog that combined author info and reading preferences was split into two separate dialogs:
  - "About Author" dialog: profile card + info grid only
  - "Reading Preferences" dialog: dark mode toggle, reading progress toggle, TOC toggle — with its own description text
- **Favorites consolidated**: Sidebar has inline favorites (limited to 5, from Phase 4), while the "All Favorites" dialog in the preferences dropdown provides the full list with delete capability — clear primary (inline) and secondary (dialog) entry points.
- **Removed unused imports**: `ArrowUpDownIcon`, `DropdownMenuLabel`, `Separator` (no longer needed after the redesign)
- **Added import**: `Settings01Icon` for the preferences button
- Verified with `npm run lint` (0 errors) and `npm run build` (compiled and generated all pages successfully)

### Expected Outcome

- The footer feels aligned with a content site rather than a logged-in dashboard
- Frequent settings become faster to reach

---

## Phase 6 - Accessibility and Interaction Polish [COMPLETED]

Clean up smaller issues after the larger layout changes are stable. Also includes a code review pass to eliminate repetition and unused code.

### Changes

- [x] Add `aria-hidden="true"` to decorative icons where appropriate
- [x] Ensure all sidebar triggers and collapsible labels have visible focus states
- [x] Replace `Loading...` with `Loading…`
- [x] Review tooltip copy for clarity in collapsed mode
- [x] Verify keyboard navigation order across all sections
- [x] Code review: extract repeated patterns, remove unused code, optimize components

### Files

- `components/app-sidebar.tsx`
- `components/nav-user.tsx`
- `components/ui/sidebar.tsx`

### Implementation Notes

#### Accessibility

- **`aria-hidden="true"`** added to all decorative `HugeiconsIcon` instances across `app-sidebar.tsx` (navMain icons, navSecondary icons, collapsible chevrons, section icons), `nav-user.tsx` (theme toggle, preferences dropdown, dialog icons, favorites list icons), and `sidebar.tsx` (SidebarTrigger icon)
- **`Loading...` → `Loading…`** replaced in both `app-sidebar.tsx` (favorites loading state) and `nav-user.tsx` (favorites dialog loading state) using proper typographic ellipsis
- **`role="list"`** added to the favorites `<ul>` in the favorites dialog for explicit list semantics
- **Focus states**: `SidebarGroupLabel` already has `focus-visible:ring-2` (from `sidebar.tsx`); `SidebarMenuButton` already has `focus-visible:ring-2`; `SidebarRail` has `aria-label="Toggle Sidebar"`; `SidebarTrigger` has `sr-only` label text — all verified as sufficient
- **Tooltip copy**: All tooltips reviewed — they use the item's display name in expanded mode and show a `sidebar-primary` colored active dot in collapsed mode (from Phase 3), which is clear and consistent
- **Keyboard navigation**: Tab order follows the visual order (main nav → favorites → recent posts → categories → utility links → theme toggle → preferences); all interactive elements are focusable; collapsible triggers are `<button>` elements from base-ui; the sidebar toggle keyboard shortcut (Ctrl+B) is registered in `SidebarProvider`

#### Code Optimizations

- **Extracted `AnimatedItem` component** in `app-sidebar.tsx` — replaces ~10 repeated `<motion.div variants={sidebarItemVariants} initial={false} animate={...}>` wrappers with a clean `<AnimatedItem animate={...}>` wrapper
- **Extracted `CollapsibleSection` component** in `app-sidebar.tsx` — encapsulates the repeated Collapsible > SidebarGroup > SidebarGroupLabel (with chevron) > CollapsibleContent > SidebarGroupContent > motion.div > SidebarMenu pattern. Used by Favorites and Categories sections; Recent Posts uses the raw pattern since it has a different empty state (Empty component)
- **Extracted `InfoCard` component** in `nav-user.tsx` — replaces 4 repeated info grid card divs in the About Author dialog with a reusable component taking `icon` and `children` props
- **Refactored `SettingRow`** in `nav-user.tsx` — `icon` prop changed from `React.ReactNode` to HugeiconsIcon `icon` prop type, with the `HugeiconsIcon` wrapper + `aria-hidden` applied internally, eliminating repeated icon wrapper markup from each call site
- **navMain icons stored as icon references** instead of JSX elements — moved from `icon: <HugeiconsIcon icon={...} />` to `icon: Home02Icon` in the data array, with `<HugeiconsIcon>` rendered at the call site. This avoids creating static JSX objects at module scope
- **Precomputed `visibleFavorites` and `overflowCount`** with `useMemo` — avoids re-slicing the favorites array and re-computing the overflow count on every render
- **Renamed internal helpers** for brevity: `shouldAnimateSidebarLists` → `shouldAnimate`, `getSidebarAnimationState` → `getAnimState`
- **Removed redundant `isMobile && "gap-0"`** in `SidebarContent` — the base class already has `gap-0`, making this conditional a no-op
- **Removed `useSidebar()` call** from `SidebarContent` — it was only used for the redundant `isMobile` check above
- **Fixed no-op `cn(className)`** in `SidebarTrigger` — replaced with direct `className` prop pass-through since `cn()` with a single argument is identity
- **Added `as const`** to the static `user` object in `nav-user.tsx` for stricter typing
- **Computed `themeLabel`** once in `nav-user.tsx` instead of repeating the ternary `theme === "dark" ? "Light Mode" : "Dark Mode"` in two places

#### Unused Code Audit

- **9 unused sidebar primitive exports identified** in `sidebar.tsx`: `SidebarGroupAction`, `SidebarInput`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarSeparator` — these are standard shadcn library primitives kept for future use, not removed
- Verified with `npm run lint` (0 errors, 0 warnings from project code) and `npm run build` (compiled and generated all 33 pages successfully)

### Expected Outcome

- Better keyboard and screen reader support
- More polished and consistent interaction behavior
- Cleaner, DRYer codebase with less repetition across sidebar components

---

## Suggested Delivery Order

If you want the safest implementation sequence:

1. Phase 1 - Mobile Foundation
2. Phase 3 - Active State and Orientation
3. Phase 2 - Navigation Hierarchy
4. Phase 4 - Content Density and Scannability
5. Phase 5 - Footer and Preferences Simplification
6. Phase 6 - Accessibility and Interaction Polish

This order improves usability early, keeps risk low, and avoids restructuring before mobile and active-state basics are fixed.

---

## Validation Checklist

After each phase:

- Test desktop expanded sidebar
- Test desktop collapsed icon sidebar
- Test mobile drawer open/close behavior
- Verify active route highlighting
- Verify keyboard navigation and focus visibility
- Run `npm run lint`

After major structural phases:

- Run `npm run build`
- Check mobile viewport behavior manually in browser devtools
