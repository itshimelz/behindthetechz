# Current Project Status and Missing Working Features

## Audit Snapshot
- Date: 2026-02-28
- Project: `Techzblog` (Next.js App Router)
- Verification run:
  - `npm run lint` -> passed
  - `npm run build` -> passed, static routes generated successfully

## Overall Status
Core routing, MDX rendering, backlinks, favorites, and graph pages compile and build correctly. The project is deployable from a build perspective.

The main gaps are not compile failures. They are feature-level behaviors where UI exists but logic is missing, stubbed, or not connected to real data.

## Features Present but Not Working Correctly

## Implementation Update (2026-02-28)
- Done: 1, 2, 4, 6, 8
- Marked for later: 3, 5, 7

## 1) Sidebar "Recent Posts" panel is a static stub
- Status: Fixed
- Evidence:
  - `components/app-sidebar.tsx:205` renders a "Recent Posts" section
  - `components/app-sidebar.tsx:215` to `components/app-sidebar.tsx:221` always renders `No posts yet`
  - No dynamic recent post data is passed into the sidebar
- Impact:
  - Users see an always-empty recent list even when posts exist

## 2) "Help" navigation item is a dead link
- Status: Fixed
- Evidence:
  - `components/app-sidebar.tsx:72` to `components/app-sidebar.tsx:74` defines `url: "#"`
  - No `app/help/` route exists in the project
- Impact:
  - Clicking Help does not navigate to any real page

## 3) Account dialog "Notifications" toggle is UI-only
- Status: Marked (pending)
- Evidence:
  - `components/nav-user.tsx:272` to `components/nav-user.tsx:275` uses `<Switch defaultChecked />`
  - No state, persistence, or behavior is wired to this setting
- Impact:
  - Toggle appears functional but does nothing

## 4) Account dialog "Reading Progress" toggle is UI-only and not wired to post behavior
- Status: Fixed
- Evidence:
  - `components/nav-user.tsx:285` to `components/nav-user.tsx:288` uses `<Switch defaultChecked />`
  - `app/blog/[slug]/page.tsx:78` always renders `<ReadingProgress />`
- Impact:
  - User preference cannot control visibility of the reading progress bar

## 5) "Log out" menu item has no action behind it
- Status: Marked (pending)
- Evidence:
  - `components/nav-user.tsx:166` to `components/nav-user.tsx:169` renders a Log out menu item
  - No auth/session integration and no click handler are attached
- Impact:
  - Action is presented as available but is non-functional

## 6) Favorites cross-tab sync cleanup is incorrect (partially working feature)
- Status: Fixed
- Evidence:
  - `hooks/use-favorites.ts:65` adds `storage` listener with an inline function
  - `hooks/use-favorites.ts:73` tries to remove `handleStorageChange` instead of the same inline function reference
- Impact:
  - Event listener is not properly removed on unmount
  - Can cause stale listeners and inconsistent behavior over time

## 7) Account stats are hardcoded and now out of sync
- Status: Marked (pending)
- Evidence:
  - `components/nav-user.tsx:57` hardcodes `postsCount: 11`
  - Current post count is higher (build output includes additional slugs)
  - `components/nav-user.tsx:58` includes `favoritesCount: 0` but not connected to actual favorites state
- Impact:
  - Profile metadata becomes inaccurate and misleading

## 8) Category detail route lacks invalid-slug guard
- Status: Fixed
- Evidence:
  - `app/categories/[slug]/page.tsx` resolves unknown slugs to an empty list
  - No `notFound()` call when category does not exist
- Impact:
  - Invalid category URLs render a normal page shell instead of a proper 404 state

## Prioritized Fix Order
1. Wire sidebar Recent Posts to real data and remove hardcoded empty state.
2. Replace dead Help link with a real route or remove the menu item.
3. Connect Account settings toggles to real persisted preferences.
4. Link reading-progress visibility to user setting.
5. Fix `useFavorites` storage listener cleanup.
6. Replace hardcoded account stats with derived runtime values.
7. Add `notFound()` handling for unknown category slugs.

## Notes
- Build and lint are green, so these are product-quality and interaction gaps rather than compile blockers.
- Existing architecture is suitable for implementing these fixes with small, focused changes.
