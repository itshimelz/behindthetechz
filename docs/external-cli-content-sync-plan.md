# External MDX CLI Content Sync Plan

## Objective

Build an external CLI tool (installed globally on local machines) that manages blog post CRUD from any MDX content folder and syncs changes safely to the Techzblog backend.

## Context and Constraints

- The CLI is **not part of this Next.js repo** and will run from separate content folders.
- Local MDX files are the authoring surface.
- Backend remains the source of published data for the website.
- Existing revalidation endpoint already exists in this project.
- Date baseline for this plan: 2026-03-01.

## High-Level Strategy

Use a **file-first + API-sync** architecture:

1. Author writes/edits `.mdx` files locally.
2. CLI validates frontmatter/content and computes diffs.
3. CLI sends authenticated CRUD requests to backend admin APIs.
4. Backend writes to DB and revalidates cache tags.
5. CLI updates local sync state for deterministic future syncs.

This avoids exposing DB credentials to every content folder and keeps security boundaries clear.

## Architecture

## Components

### 1) External CLI Package (`techz-blog-cli`)
- Distributed via npm (`npm i -g techz-blog-cli`) and `npx` compatible.
- Responsibilities:
  - Parse MDX + frontmatter.
  - Validate schema and content rules.
  - Compute local vs remote diff.
  - Execute CRUD operations through API.
  - Track sync metadata locally.

### 2) Local Content Workspace
- Example structure:

```text
my-posts/
  .techzblogrc.json
  .techzblog/
    state.json
  posts/
    intro-to-rust.mdx
    কোটলিন-পরিচিতি.mdx
```

### 3) Techzblog Backend Admin API
- Hosted with the main Next.js app.
- New secured routes under `/api/admin/posts/*` for machine-to-machine operations.
- Uses Prisma and existing content model (`Post`, `Category`, `Tag`).

## Data Model for File Authoring

Each post file uses frontmatter + body:

```yaml
---
slug: intro-to-rust
title: Intro to Rust
excerpt: Quick start for Rust fundamentals.
status: DRAFT # DRAFT | PUBLISHED | ARCHIVED
publishedAt: 2026-03-01T10:30:00.000Z
coverImage: https://...
featured: false
categories:
  - programming
tags:
  - rust
  - systems
---

# Intro
...
```

### Frontmatter Rules

- Required: `slug`, `title`, `excerpt`, `status`.
- Optional: `publishedAt`, `coverImage`, `featured`, `categories`, `tags`.
- `slug` must be unique and Unicode-safe (Bengali slugs allowed).
- On `PUBLISHED`, `publishedAt` must exist (auto-fill allowed by CLI).

## CLI Command Design

## Core Commands

- `techz init`
  - Creates `.techzblogrc.json`, `.techzblog/state.json`, sample post template.
- `techz validate`
  - Validates frontmatter schema, slug rules, broken wikilinks, MDX parse errors.
- `techz diff`
  - Shows create/update/delete/publish drift between local and remote.
- `techz push`
  - Applies diff to remote (supports batch and selective by slug/path).
- `techz pull`
  - Downloads/updates local files from remote posts.
- `techz create <slug>`
  - Creates a new MDX file from template.
- `techz update <slug>`
  - Pushes update for one post.
- `techz delete <slug>`
  - Deletes remote post with safety checks.
- `techz publish <slug>` / `techz unpublish <slug>` / `techz archive <slug>`
  - Status transitions with server-side validation.
- `techz revalidate`
  - Calls revalidation endpoint when needed.
- `techz doctor`
  - Health check for auth, API reachability, and config correctness.

## Recommended Flags

- `--dry-run`
- `--json`
- `--yes`
- `--filter status=DRAFT`
- `--only <slug>`
- `--concurrency <n>`

## Local Configuration

`.techzblogrc.json` example:

```json
{
  "schemaVersion": 1,
  "workspace": "techz-personal-notes",
  "apiBaseUrl": "https://your-domain.com",
  "contentDir": "posts",
  "defaultStatus": "DRAFT",
  "defaultCategorySlugs": ["programming"],
  "auth": {
    "mode": "token",
    "tokenEnv": "TECHZBLOG_API_TOKEN"
  },
  "revalidate": {
    "enabled": true,
    "tags": ["blog:posts", "blog:categories", "blog:tags", "blog:backlinks", "blog:graph"]
  }
}
```

## Sync State Design

Store deterministic metadata in `.techzblog/state.json`:

- per-file content hash
- last pushed revision id
- remote post id
- last sync timestamp

Use this state to support fast incremental sync and accurate change detection.

## Backend API Contract (Proposed)

## Endpoints

- `POST /api/admin/posts/sync/diff`
  - Input: local manifests (`slug`, hash, updatedAt).
  - Output: actions required (`create|update|delete|noop`).
- `POST /api/admin/posts/sync/apply`
  - Input: batch of CRUD actions.
  - Output: per-item result, revision ids, errors.
- `GET /api/admin/posts/:slug`
- `POST /api/admin/posts`
- `PATCH /api/admin/posts/:slug`
- `DELETE /api/admin/posts/:slug`
- `POST /api/admin/posts/:slug/publish`
- `POST /api/admin/posts/:slug/unpublish`
- `POST /api/admin/posts/:slug/archive`

## Payload and Validation Rules

- Enforce same schema constraints as Prisma model.
- Categories and tags resolved by slug (upsert optional).
- Reject malformed MDX or return warning mode based on endpoint.
- Return structured error codes for CLI UX (`SLUG_CONFLICT`, `INVALID_FRONTMATTER`, etc.).

## Authentication and Security

Minimum viable security model:

- Bearer token in `Authorization` header.
- Token stored in env var (`TECHZBLOG_API_TOKEN`), never committed.
- Server validates token against secure store.

Better model (phase 2+):

- Short-lived signed tokens (JWT) with scopes:
  - `posts:read`, `posts:write`, `posts:publish`, `revalidate:write`
- Optional per-workspace key rotation.
- API rate limits and audit log for every mutation.

## Error Handling and Safety

- All destructive commands require:
  - confirmation prompt
  - `--yes` override for CI
- Batch apply supports partial success with clear report.
- Idempotency key per request to make retries safe.
- `techz push --dry-run` required in docs before first production push.

## Conflict Resolution Policy

Define explicit behavior for local vs remote drift:

- Default: **remote wins only when local unchanged**.
- If both changed since last sync: mark conflict and stop auto-apply.
- Provide `techz resolve --strategy local|remote|manual`.

## Revalidation Strategy

After any successful mutation, backend triggers tag revalidation:

- `blog:posts`
- `blog:categories`
- `blog:tags`
- `blog:backlinks`
- `blog:graph`

Prefer backend-triggered revalidation to avoid missed invalidations.

## Delivery Plan

## Phase 1 — CLI Foundation (1 week)

- Package scaffolding (`commander`, `zod`, `gray-matter`, MDX parser).
- Implement `init`, `validate`, `create`, `doctor`.
- Add config and state file support.

Exit criteria:
- A new workspace can be initialized and validated end-to-end locally.

## Phase 2 — Remote CRUD Sync (1–2 weeks)

- Add backend admin APIs for post CRUD.
- Implement CLI `diff`, `push`, `pull`, `update`, `delete`.
- Add auth token checks and audit logs.

Exit criteria:
- CLI can safely create/update/delete posts in remote DB.

## Phase 3 — Publishing Workflow (1 week)

- Implement `publish|unpublish|archive` flows.
- Add status-specific validation rules.
- Auto revalidation and result summaries.

Exit criteria:
- Publish and rollback workflows are reliable and traceable.

## Phase 4 — Conflict/CI Hardening (1 week)

- Add conflict detection/resolution commands.
- Add idempotency and retry logic.
- Add CI mode (`validate + diff --fail-on-drift`).

Exit criteria:
- Tool is automation-ready and resilient.

## Testing and Quality Gates

## CLI Tests

- Unit tests: parser, schema validation, diff engine.
- Integration tests: against mock API + staging API.
- Snapshot tests for command outputs.

## Backend Tests

- API contract tests for all CRUD transitions.
- Permission/auth tests.
- Revalidation side-effect verification.

## Release Gates

- No unhandled error paths in mutation commands.
- 100% command help text coverage.
- Migration guide for schemaVersion changes.

## Observability

- CLI structured logs (`--json`) for CI.
- Correlation id per run.
- Backend audit trail per mutation with actor + workspace.

## Risks and Mitigations

- **Risk:** Slug changes break existing links.
  - **Mitigation:** enforce immutable published slug or create redirect records.
- **Risk:** Accidental mass deletion.
  - **Mitigation:** two-step confirmation + max delete threshold + dry-run default in docs.
- **Risk:** Divergent local/remote state.
  - **Mitigation:** state hashes + conflict detection + mandatory diff before apply.
- **Risk:** Token leakage.
  - **Mitigation:** env-only token storage and short-lived scoped tokens.

## Immediate Next Actions

1. Approve this architecture (file-first + API-sync).
2. Finalize `.techzblogrc` schema.
3. Define backend admin API routes and auth middleware.
4. Scaffold separate `techz-blog-cli` repository.
5. Implement Phase 1 commands and run against sample content folder.

## Future Enhancements

- Scheduled publishing with timezone support.
- Media upload command integrated with Supabase Storage.
- Team workflows (review status, approvals, role-based commands).
- AI-assisted metadata generation (`excerpt`, tags, title suggestions).

## CLI to TUI Migration Plan

## Goal

Evolve `techz-blog-cli` into an interactive terminal application (TUI) while preserving scriptable CLI behavior for automation and CI.

## Design Principle

Do not replace the CLI engine. Add a TUI layer on top of shared core services.

Target package architecture:

```text
techz-blog-cli/
  src/
    core/      # business logic: parse, validate, diff, sync, publish
    cli/       # commander command handlers (non-interactive)
    tui/       # interactive terminal UI (Ink/React)
    shared/    # types, errors, config/state IO, logger
```

## Recommended TUI Stack

- `ink` + `react` for terminal screens and components.
- `commander` keeps command routing (`techz tui`).
- `zod` for shared request/config validation.
- `chalk` for semantic colors and status text.
- `ink-spinner` or task progress components for async operations.
- External editor integration for content editing via `$EDITOR`.

Rationale:
- Ink enables fast UI iteration and stateful views.
- Shared core avoids duplicated logic between CLI and TUI.

## Command Entry Strategy

Keep existing commands and add interactive entry points:

- `techz tui`
  - Opens full interactive dashboard.
- `techz posts`
  - Optional shortcut directly to post list view.
- `techz sync`
  - Optional shortcut to diff/sync view.

CI-safe behavior:
- Non-interactive commands remain unchanged.
- TUI is never required for automation.

## TUI Information Architecture

## Primary Screens

1. **Home / Dashboard**
   - Workspace info, API status, auth status, dirty file count, pending diff summary.
2. **Posts List**
   - Searchable/filterable list by status/category/tag.
3. **Post Detail**
   - Metadata, validation warnings, last sync state, quick actions.
4. **Diff Review**
   - Grouped operations (`create`, `update`, `delete`, `publish`, `noop`).
5. **Sync Results / Logs**
   - Batch results, errors, retry options.
6. **Settings**
   - Local config preview, token env check, paths.

## User Flows

### Flow A: Daily Editing and Sync
1. Launch `techz tui`.
2. Home shows pending updates.
3. Open Diff Review.
4. Inspect updates and run dry-run apply.
5. Confirm push.
6. Review sync results and revalidation status.

### Flow B: Publish One Post
1. Find post in Posts List.
2. Open Post Detail.
3. Run Validate action.
4. Trigger Publish action.
5. Confirm and view status update.

### Flow C: Resolve Conflict
1. Diff Review flags conflict.
2. Open Conflict Panel.
3. Choose strategy (`local`, `remote`, `manual`).
4. Apply and re-run diff.

## Keyboard and Interaction Model

- Navigation: `j/k` or arrow keys.
- Select/action: `Enter`.
- Back: `Esc`.
- Search: `/`.
- Filters: `f`.
- Dry-run toggle: `d`.
- Apply sync: `s`.
- Refresh data: `r`.
- Quit: `q`.

Accessibility and UX rules:
- Always show current screen and active selection.
- Keep destructive actions behind confirmation prompts.
- Provide clear non-color status markers (`OK`, `WARN`, `ERR`).

## State Management Model

Use a simple app state container inside `tui/`:

- `workspaceState`
  - config, auth, content path, health checks.
- `postState`
  - local manifest, filters, selected post.
- `syncState`
  - pending diff, last run results, conflict list.
- `uiState`
  - current screen, focused pane, notifications.

Data loading policy:
- Initial load on app start.
- Manual refresh key (`r`).
- Optional polling disabled by default.

## Core Service Interface (Shared)

Define stable service contracts consumed by both CLI and TUI:

- `loadWorkspace()`
- `validateWorkspace()`
- `buildManifest()`
- `computeDiff()`
- `applyDiff()`
- `publishPost(slug)`
- `archivePost(slug)`
- `deletePost(slug)`

Benefits:
- One logic path for both interfaces.
- Lower bug surface and simpler testing.

## Implementation Phases for TUI

## Phase T1 — Read-only TUI Shell (3–5 days)

- Add `techz tui` command.
- Implement Home, Posts List, Post Detail (read-only).
- Wire health checks and local parsing.

Exit criteria:
- User can inspect workspace and posts interactively.

## Phase T2 — Diff and Validation Views (3–5 days)

- Add Diff Review screen.
- Add validation panel with grouped errors/warnings.
- Add dry-run execution in TUI.

Exit criteria:
- User can inspect full sync plan and validation status before writing.

## Phase T3 — Mutating Actions (5–7 days)

- Add push/apply, publish, unpublish, archive, delete actions.
- Add confirmations and operation progress feedback.
- Add structured error rendering and retry per item.

Exit criteria:
- Full CRUD and lifecycle management possible from TUI.

## Phase T4 — Conflict and Reliability Hardening (3–5 days)

- Add conflict resolution screen.
- Add idempotency-aware retries.
- Add crash-safe recovery hints (resume last diff/apply).

Exit criteria:
- TUI handles failure and drift scenarios safely.

## Testing Strategy for TUI

- Component tests for screen rendering and key interactions.
- Service contract tests to ensure TUI and CLI outputs match.
- Golden/snapshot tests for critical terminal views.
- End-to-end smoke tests using fixture workspaces.

## Operational Guardrails

- Keep non-interactive CLI as first-class path for CI/CD.
- TUI should call the same audited API endpoints.
- Do not expose secrets in screen output or logs.
- Require explicit confirmation for destructive operations.

## Definition of Done (TUI Adoption)

- `techz tui` supports day-to-day author workflow without needing raw commands.
- Existing CLI commands remain backward compatible.
- TUI and CLI both rely on shared core services.
- Conflict, error, and destructive operation paths are validated.
- Documentation includes keybindings and workflow examples.