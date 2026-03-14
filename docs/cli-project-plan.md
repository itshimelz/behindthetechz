# `behindthetechz-cli` — CLI Project Plan

> A standalone TypeScript CLI tool for managing blog content and syncing to the Techzblog backend.
> Lives at `d:\WebProjects\behindthetechz-cli\` — its own folder with its own Git repo, sitting alongside the blog project for easy cross-referencing.

---

## Table of Contents

1. [Content Workspace — How It Works](#content-workspace--how-it-works)
2. [Project Location & Git Setup](#project-location--git-setup)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Phase 1 — Scaffold & Tooling](#phase-1--scaffold--tooling)
6. [Phase 2 — Core Services](#phase-2--core-services)
7. [Phase 3 — CLI Commands (Read-Only)](#phase-3--cli-commands-read-only)
8. [Phase 4 — Sync & Mutation Commands](#phase-4--sync--mutation-commands)
9. [Phase 5 — Status & Auth Commands](#phase-5--status--auth-commands)
10. [Phase 6 — TUI Shell (Optional Future)](#phase-6--tui-shell-optional-future)
11. [Testing Strategy](#testing-strategy)
12. [Distribution](#distribution)
13. [Config & State Reference](#config--state-reference)
14. [API Contract Reference](#api-contract-reference)

---

## Content Workspace — How It Works

The CLI is **location-aware**. It reads the current working directory when you open a terminal in your posts folder. No global path config, no arguments needed — just `cd` into the folder and run commands.

### One-time setup (run once per content folder)

```powershell
# 1. Create your posts folder anywhere on your PC
New-Item -ItemType Directory D:\MyBlogPosts
cd D:\MyBlogPosts

# 2. Initialize the workspace — CLI creates .techzblogrc.json here
techz init
```

`techz init` will prompt you for:

- Your blog API URL (e.g. `https://behindthetechz.com`)
- A workspace name (just a label, e.g. `personal-notes`)
- Where your MDX files live — **reply `.` to keep posts in this folder itself**

### Folder structure after init

```
D:\MyBlogPosts\          ← your content folder (any location on your PC)
  .techzblogrc.json      ← config (created by techz init)
  .techzblog/
    state.json           ← sync state (auto-managed, don't edit)
  intro-to-rust.mdx      ← your posts live directly here
  কোটলিন-পরিচিতি.mdx
  another-post.mdx
```

If you prefer a subfolder (e.g. `posts/`), just answer `posts` when `techz init` asks for `contentDir`.

### Daily usage

```powershell
# Open terminal in your posts folder
cd D:\MyBlogPosts

# Write a new post
techz create my-new-post           # creates my-new-post.mdx with frontmatter template
# ... edit the file in your editor ...

# Check what will change before pushing
techz diff

# Push changes to the live blog
techz push

# Publish a specific post
techz publish my-new-post
```

The CLI never needs to know your folder path in advance — it always resolves from `process.cwd()` at runtime.

### Multiple content folders

You can have as many content folders as you want (e.g. one for drafts, one for published work). Each gets its own `.techzblogrc.json` and `.techzblog/state.json`. Just `cd` into whichever one you want to work with.

```
D:\
├── MyBlogPosts\         ← main posts folder
│   └── .techzblogrc.json
└── DraftPosts\          ← drafts-only folder (different workspace name in config)
    └── .techzblogrc.json
```

> **Token:** Set `TECHZBLOG_API_TOKEN` as a machine-level environment variable in Windows so every terminal session has it automatically. No need to set it per-folder.

## Project Location & Git Setup

The CLI lives as a **sibling project** to the blog, not inside it. This keeps both repos clean while keeping them easy to work on together in the same IDE session.

```
d:\WebProjects\
├── Techzblog\          ← Next.js blog (existing)
└── behindthetechz-cli\     ← CLI project (new, own Git)
```

### Initialize the repo

```powershell
# Create the folder
New-Item -ItemType Directory d:\WebProjects\behindthetechz-cli
cd d:\WebProjects\behindthetechz-cli

# Initialize fresh git repo (separate from Techzblog)
git init
git branch -M main
```

### Branching strategy for the CLI

| Branch        | Purpose                    |
| ------------- | -------------------------- |
| `main`        | Stable, published releases |
| `feat/<name>` | Feature work               |
| `fix/<name>`  | Bug fixes                  |

---

## Technology Stack

All tools chosen for: fast cold starts, PowerShell 7 compatibility, zero config overhead, and TypeScript-first DX.

| Role                 | Tool                  | Why                                                           |
| -------------------- | --------------------- | ------------------------------------------------------------- |
| Language             | **TypeScript 5**      | Type safety, great autocomplete for complex schemas           |
| Runtime              | **Node.js 22 LTS**    | Native ESM, `--env-file` flag, built-in `fetch`               |
| CLI parsing          | **Commander.js v12**  | Mature, excellent TS types, subcommand support                |
| Build                | **tsup**              | esbuild-powered, handles shebang, single-file output          |
| Dev runner           | **tsx**               | Run TS directly without compiling during development          |
| Validation           | **Zod v3**            | Same schemas as the blog backend — consistent contract        |
| Frontmatter          | **gray-matter**       | Parse YAML frontmatter from `.mdx` files                      |
| Terminal output      | **chalk v5**          | ESM-native color output                                       |
| Prompts              | **@inquirer/prompts** | Modern ESM-native interactive prompts (replaces old Inquirer) |
| Spinners             | **ora v8**            | ESM-native spinner for async ops                              |
| HTTP client          | **native `fetch`**    | Node 22 has full fetch — no extra dep needed                  |
| Testing              | **Vitest**            | Fast, TS-native, great for unit + integration                 |
| Linting & Formatting | **Biome**             | One tool for both, replaces ESLint + Prettier                 |
| TUI (future)         | **Ink v5**            | React for terminal — add in Phase 6                           |

### PowerShell 7 compatibility notes

- All scripts use `cross-env` syntax (`TECHZBLOG_API_TOKEN=...`) avoided in favor of `.env` file loading.
- The CLI entry point is a Node.js script — works identically in pwsh, cmd, and bash.
- `package.json` `bin` field registers the `techz` command globally via `npm link` or `npm i -g`.
- No shell-specific path separators in code — always use `node:path` for file operations.

---

## Project Structure

```
behindthetechz-cli/
├── src/
│   ├── cli/                    # Commander command definitions
│   │   ├── index.ts            # Root program + command registration
│   │   ├── init.ts
│   │   ├── validate.ts
│   │   ├── diff.ts
│   │   ├── push.ts
│   │   ├── pull.ts
│   │   ├── create.ts
│   │   ├── update.ts
│   │   ├── delete.ts
│   │   ├── publish.ts
│   │   ├── unpublish.ts
│   │   ├── archive.ts
│   │   ├── revalidate.ts
│   │   └── doctor.ts
│   ├── core/                   # Pure business logic (no CLI awareness)
│   │   ├── config.ts           # Load/save .techzblogrc.json
│   │   ├── state.ts            # Load/save .techzblog/state.json
│   │   ├── parser.ts           # Parse MDX + frontmatter with gray-matter
│   │   ├── validator.ts        # Zod schema validation for frontmatter
│   │   ├── manifest.ts         # Build local file manifest (slug → hash)
│   │   ├── diff.ts             # Compute local vs remote diff
│   │   └── hash.ts             # Content hashing (SHA-256 via node:crypto)
│   ├── api/                    # HTTP client wrappers for admin API
│   │   ├── client.ts           # Authenticated fetch wrapper
│   │   ├── posts.ts            # CRUD calls
│   │   ├── sync.ts             # diff + apply calls
│   │   └── revalidate.ts       # revalidation call
│   ├── shared/                 # Types, errors, constants
│   │   ├── types.ts
│   │   ├── errors.ts
│   │   └── schemas.ts          # Zod schemas (frontmatter, API payloads)
│   └── tui/                    # (Phase 6) Ink TUI components
│       └── index.tsx
├── tests/
│   ├── core/
│   │   ├── parser.test.ts
│   │   ├── validator.test.ts
│   │   └── diff.test.ts
│   └── api/
│       └── client.test.ts
├── fixtures/                   # Sample .mdx files for tests
│   ├── valid-post.mdx
│   └── invalid-frontmatter.mdx
├── .env.example
├── biome.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── package.json
```

---

## Phase 1 — Scaffold & Tooling

**Duration:** ~2–3 hours
**Goal:** Working project with `techz --help` running from source.

### Steps

#### 1. Initialize the project

```powershell
cd d:\WebProjects\behindthetechz-cli
npm init -y
```

#### 2. Install dependencies

```powershell
# Runtime
npm install commander zod gray-matter chalk ora @inquirer/prompts

# Dev
npm install -D typescript tsx tsup vitest @biomejs/biome @types/node
```

#### 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 4. `tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli/index.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  shims: true, // adds __dirname/__filename for ESM
  banner: {
    js: "#!/usr/bin/env node", // makes the output executable
  },
});
```

#### 5. `package.json` key fields

```json
{
  "name": "behindthetechz-cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "techz": "./dist/index.js"
  },
  "scripts": {
    "dev": "tsx src/cli/index.ts",
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "biome check .",
    "format": "biome format --write .",
    "link": "npm run build && npm link"
  }
}
```

#### 6. `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "organizeImports": { "enabled": true }
}
```

#### 7. `src/cli/index.ts` — entry point

```typescript
#!/usr/bin/env node
import { program } from "commander";
import { version } from "../../package.json" assert { type: "json" };

program
  .name("techz")
  .description("Techzblog content CLI — manage MDX posts from anywhere")
  .version(version);

// Commands registered here in later phases

program.parse(process.argv);
```

#### 8. Test it

```powershell
npm run dev -- --help
```

**Exit criteria:** `techz --help` prints the CLI usage with name and version.

---

## Phase 2 — Core Services

**Duration:** ~1 day
**Goal:** All non-HTTP business logic implemented and tested.

### Files to build

#### `src/shared/schemas.ts` — Zod frontmatter schema

```typescript
import { z } from "zod";

export const frontmatterSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  excerpt: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().datetime().nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  series: z.string().nullable().optional(),
  seriesOrder: z.number().int().positive().nullable().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
```

#### `src/core/parser.ts` — MDX file parser

Reads a `.mdx` file, splits frontmatter with `gray-matter`, validates with Zod, returns `{ data: Frontmatter, content: string }`.

#### `src/core/hash.ts` — content hash

Uses `node:crypto` `createHash("sha256")` on the full file buffer. Returns hex string.

#### `src/core/config.ts` — workspace config

Looks for `.techzblogrc.json` starting from `process.cwd()` and walking up parent directories (like Git does). This means you can run `techz` commands from any subdirectory inside your posts folder and it will still find the config. Validates with Zod. Returns a typed config object.

#### `src/core/state.ts` — sync state

Loads/saves `.techzblog/state.json`. Tracks per-slug: `{ contentHash, remoteId, revisionId, lastSyncedAt }`.

#### `src/core/manifest.ts` — local manifest builder

Resolves the content directory as `path.resolve(process.cwd(), config.contentDir)`. So `contentDir: "."` means the posts folder root itself, and `contentDir: "posts"` means a `posts/` subfolder. Scans for all `.mdx` files (non-recursive by default), parses each, and builds a map of `slug → { hash, frontmatter, filePath }`.

#### `src/core/diff.ts` — diff engine

```typescript
export type DiffAction = "create" | "update" | "delete" | "noop";

export interface DiffEntry {
  slug: string;
  action: DiffAction;
  reason?: string;
}

export function computeDiff(
  localManifest: LocalManifest,
  remoteManifest: RemoteManifest,
  state: SyncState,
): DiffEntry[];
```

Logic:

- In local but not in state → `create`
- In local + state but hash changed → `update`
- In state but not in local → `delete` (with safety warning)
- In state + local, hash unchanged → `noop`

**Exit criteria:** All core services have unit tests in `tests/core/` passing.

---

## Phase 3 — CLI Commands (Read-Only)

**Duration:** ~1 day
**Goal:** Implement all commands that don't mutate remote data.

### Commands

#### `techz init`

- Checks for existing `.techzblogrc.json` (bail if present unless `--force`).
- Prompts for `apiBaseUrl`, `workspace` name, `contentDir` using `@inquirer/prompts`.
- Writes `.techzblogrc.json`, creates `.techzblog/state.json`, creates `posts/` dir with a sample `.mdx` template.

#### `techz validate`

- Loads all `.mdx` files in `contentDir`.
- Validates frontmatter with Zod.
- Checks for duplicate slugs.
- Reports errors/warnings in a colored table.
- `--json` flag for machine-readable output.

#### `techz create <slug>`

- Creates a new `.mdx` file from the template with the given slug pre-filled.
- Refuses if file already exists.

#### `techz doctor`

- Checks: config file present ✓, `TECHZBLOG_API_TOKEN` env var set ✓, API reachable (GET `/api/admin/posts`) ✓.
- Colored ✓ / ✗ output for each check.

#### `techz diff`

- Calls `GET /api/admin/posts` to get remote manifest.
- Computes diff with local files.
- Prints grouped summary: N to create, N to update, N to delete, N unchanged.
- `--json` for machine output.

### Output formatting conventions

All commands follow this pattern:

```
✔  Created  intro-to-rust             (create)
✎  Updated  kotlin-parichiti          (update)
✘  Deleted  old-post                  (delete)  [remote]
─  Skipped  another-post              (no change)
```

**Exit criteria:** All three read-only commands work end-to-end with a local fixture workspace.

---

## Phase 4 — Sync & Mutation Commands

**Duration:** ~1–2 days
**Goal:** Push, pull, update, delete — all mutating commands.

### `src/api/client.ts` — HTTP wrapper

```typescript
export async function apiRequest<T>(
  config: Config,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const token = process.env.TECHZBLOG_API_TOKEN;
  if (!token) throw new AuthError("TECHZBLOG_API_TOKEN is not set");

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err?.error ?? "UNKNOWN_ERROR");
  }

  return res.json() as Promise<T>;
}
```

### `techz push`

1. Run diff (calls `/api/admin/posts/sync/diff`).
2. Show summary. Prompt for confirmation (skip with `--yes`).
3. Send batch apply in chunks of 5 to `/api/admin/posts/sync/apply`.
4. Show progress with `ora` spinner per batch.
5. Update local `state.json` with new `revisionId` for each success.
6. Print final report.

Flags: `--dry-run`, `--yes`, `--only <slug>`, `--concurrency <n>` (default 5).

### `techz pull`

- Calls `GET /api/admin/posts`.
- For each post: writes/updates local `.mdx` file from remote content.
- Updates `state.json`.
- Warns about local-only files that would be overwritten.

### `techz update <slug>`

- Single-post push for one slug.
- Validates frontmatter first.
- Calls `PATCH /api/admin/posts/:slug`.
- Updates `state.json`.

### `techz delete <slug>`

- Two-step: shows post details, asks confirmation.
- `--yes` to skip.
- Calls `DELETE /api/admin/posts/:slug`.
- Removes slug from `state.json`.

### `techz image upload <files...>`

- Uploads multiple images locally to the Supabase Storage bucket.
- Handles parsing complexities between Node.js `FormData` and Next.js App Router endpoints.
- Returns MDX-compatible image URLs for immediate use in markdown content.
- Generates descriptive UUID-based or timestamped filenames to prevent collisions.

**Exit criteria:** `techz push --dry-run` shows correct plan; `techz push --yes` on a fixture workspace creates posts in the blog DB.

---

## Phase 5 — Status & Auth Commands

**Duration:** ~half day
**Goal:** Publish / unpublish / archive + revalidation command.

### `techz publish <slug>`

- Validates that `contentMdx` is not empty locally.
- Sets `publishedAt` to now if not already set.
- Calls `POST /api/admin/posts/:slug/publish`.
- Updates local frontmatter `status: PUBLISHED` and `publishedAt`.
- Updates `state.json`.

### `techz unpublish <slug>`

- Calls `POST /api/admin/posts/:slug/unpublish`.
- Updates local frontmatter `status: DRAFT`.

### `techz archive <slug>`

- Calls `POST /api/admin/posts/:slug/archive`.
- Updates local frontmatter `status: ARCHIVED`.

### `techz revalidate`

- Calls `POST /api/revalidate` with default tags.
- Flags: `--tags blog:posts,blog:graph` to override.

**Exit criteria:** Status transitions work and are reflected in both remote DB and local `.mdx` frontmatter.

---

## Phase 6 — TUI Shell (Optional Future)

**Duration:** ~1 week (separate feature branch)
**Goal:** Add `techz tui` — an interactive terminal dashboard using Ink.

### Additional dependency

```powershell
npm install ink react
npm install -D @types/react
```

### Entry point

```powershell
techz tui          # Opens full TUI dashboard
techz posts        # Shortcut: post list view
techz sync         # Shortcut: diff/sync view
```

### Screens (see `external-cli-content-sync-plan.md` for full TUI plan)

1. **Home / Dashboard** — health status, dirty count, pending diff summary
2. **Posts List** — filterable by status / category / tag
3. **Post Detail** — metadata, validation, quick actions
4. **Diff Review** — grouped operations, dry-run toggle
5. **Sync Results** — per-item results, retry per failure

All screens call the same `core/` service functions as the CLI commands. The TUI is only an interface layer.

---

## Testing Strategy

### Unit tests

Test each `core/` service in isolation with fixture files.

```
tests/core/parser.test.ts       # Parse valid + invalid MDX
tests/core/validator.test.ts    # Zod schema edge cases (Bengali slugs, etc.)
tests/core/diff.test.ts         # All diff scenarios (create/update/delete/noop)
tests/core/hash.test.ts         # Hash determinism
```

### Integration tests

```
tests/api/client.test.ts        # Mock fetch, verify request shape + error handling
```

Use `vitest`'s `vi.mock()` to stub `fetch` — no real network calls in tests.

### `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
    },
  },
});
```

---

## Distribution

### Local development (`npm link`)

```powershell
npm run build
npm link
# Now `techz` is available globally in PowerShell 7
techz --help
```

### Publish to npm (when ready)

```powershell
npm run build
npm publish --access public
```

Other machines install with:

```powershell
npm install -g behindthetechz-cli
```

---

## Config & State Reference

### `.techzblogrc.json`

```json
{
  "schemaVersion": 1,
  "workspace": "personal-notes",
  "apiBaseUrl": "https://behindthetechz.live",
  "contentDir": ".",
  "defaultStatus": "DRAFT",
  "defaultCategorySlugs": ["programming"],
  "auth": {
    "mode": "token",
    "tokenEnv": "TECHZBLOG_API_TOKEN"
  },
  "revalidate": {
    "enabled": true,
    "tags": [
      "blog:posts",
      "blog:categories",
      "blog:tags",
      "blog:backlinks",
      "blog:graph"
    ]
  }
}
```

> `contentDir: "."` means MDX files live directly in the same folder as the config. Change to `"posts"` if you prefer a subfolder.

### `.techzblog/state.json`

```json
{
  "intro-to-rust": {
    "contentHash": "a3f9...",
    "remoteId": "uuid-here",
    "revisionId": "2026-03-02T12:00:00.000Z",
    "lastSyncedAt": "2026-03-02T12:00:00.000Z"
  }
}
```

---

## API Contract Reference

All calls go to the admin API defined in `docs/admin-api-implementation-plan.md`.

| CLI command              | HTTP call                               |
| ------------------------ | --------------------------------------- |
| `techz diff`             | `POST /api/admin/posts/sync/diff`       |
| `techz push`             | `POST /api/admin/posts/sync/apply`      |
| `techz pull`             | `GET /api/admin/posts`                  |
| `techz create`           | (local only, no API call)               |
| `techz update <slug>`    | `PATCH /api/admin/posts/:slug`          |
| `techz delete <slug>`    | `DELETE /api/admin/posts/:slug`         |
| `techz publish <slug>`   | `POST /api/admin/posts/:slug/publish`   |
| `techz unpublish <slug>` | `POST /api/admin/posts/:slug/unpublish` |
| `techz archive <slug>`   | `POST /api/admin/posts/:slug/archive`   |
| `techz revalidate`       | `POST /api/revalidate`                  |
| `techz doctor`           | `GET /api/admin/posts` (health probe)   |
| `techz image upload`     | `POST /api/admin/upload`                |
| `techz subscribers`      | `GET /api/admin/newsletter`             |
| `techz subscribers list` | `GET /api/admin/newsletter`             |
| `techz subscribers export` | `GET /api/admin/newsletter` → local CSV |
| `techz subscribers remove <email>` | `DELETE /api/admin/newsletter` |

---

_Plan date: 2026-03-02 — Aligned with `external-cli-content-sync-plan.md` and `admin-api-implementation-plan.md`_
