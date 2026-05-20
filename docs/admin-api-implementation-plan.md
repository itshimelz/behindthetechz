# Admin API Implementation Plan — Vercel Serverless

> Phase-by-phase plan for building the backend admin API routes that the `behindthetechz-cli` will consume.
> All work is done on a **separate feature branch** to keep `master` stable.

---

## Table of Contents

1. [Branch Strategy](#branch-strategy)
2. [Auth Strategy (JWT Answer)](#auth-strategy)
3. [Vercel & Prisma Best Practices Checklist](#vercel--prisma-best-practices)
4. [Phase 0 — Branch & Scaffolding](#phase-0--branch--scaffolding)
5. [Phase 1 — Auth Middleware](#phase-1--auth-middleware)
6. [Phase 2 — Single-Post CRUD Routes](#phase-2--single-post-crud-routes)
7. [Phase 3 — Status Transitions](#phase-3--status-transitions)
8. [Phase 4 — Batch Sync Routes](#phase-4--batch-sync-routes)
9. [Phase 5 — Hardening & Deployment](#phase-5--hardening--deployment)
10. [Phase 6 — Verification & Merge](#phase-6--verification--merge)

---

## Branch Strategy

All admin API work is done on the **`feat/admin-api`** branch, keeping `master` clean and deployable at all times.

### Setup

```powershell
# Create and switch to the feature branch
git checkout -b feat/admin-api
```

### Day-to-day workflow

```powershell
# Make changes, commit, push
git add .
git commit -m "feat(admin-api): add POST /api/admin/posts"
git push origin feat/admin-api

# Periodically rebase on master to stay current
git fetch origin
git rebase origin/master
```

### Merging when complete

```powershell
# Switch back to master and merge
git checkout master
git merge feat/admin-api

# Push to trigger production deployment
git push origin master

# Clean up
git branch -d feat/admin-api
```

### Branch rules

- Commit often with descriptive `feat(admin-api): ...` messages.
- Push to `origin feat/admin-api` regularly — Vercel auto-creates a **Preview Deployment** for testing.
- Don't merge to `master` until all phases are verified on the preview URL.

---

## Auth Strategy

> Answering the question: _"Will I use JWT with token rotation and then update the token automatically in my CLI config?"_

### Recommended: Two-Phase Approach

#### Phase 1 MVP — Static Bearer Token (start here)

For a **single-author personal blog**, a static bearer token is secure enough and dramatically simpler to implement:

| Aspect               | Detail                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **Token**            | Random 64-char hex string                                         |
| **Storage (server)** | `ADMIN_API_TOKEN` env var in Vercel dashboard                     |
| **Storage (CLI)**    | `TECHZBLOG_API_TOKEN` env var on your machine                     |
| **Validation**       | Simple string comparison in middleware                            |
| **Rotation**         | Manual: generate new token → update Vercel env → update local env |

**Why this is fine for now:**

- You are the only user.
- HTTPS encrypts the token in transit.
- Env vars are never committed.
- You can rotate anytime by changing both sides.

**Generate a token:**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Phase 2 (Later) — JWT with Scoped Permissions

Upgrade to JWT when you add **multiple authors, CI pipelines, or the TUI**:

```
┌──────────┐   POST /api/admin/auth/token   ┌──────────────┐
│  CLI     │ ─────────────────────────────► │ Next.js API  │
│          │   { clientId, clientSecret }    │              │
│          │ ◄───────────────────────────── │  Signs JWT   │
│          │   { accessToken, expiresIn }   │              │
└──────────┘                                └──────────────┘
     │                                            │
     │  Authorization: Bearer <jwt>                │
     ▼                                            ▼
   API calls                              Verify JWT signature
                                          Check scopes & expiry
```

| Aspect           | Detail                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| **Signing**      | `jose` library, HS256 with `JWT_SECRET` env var                              |
| **Scopes**       | `posts:read`, `posts:write`, `posts:publish`, `revalidate:write`             |
| **Expiry**       | Access token: 1 hour. Refresh token: 30 days                                 |
| **Auto-refresh** | CLI detects 401, calls `/api/admin/auth/refresh`                             |
| **Rotation**     | Rotate `JWT_SECRET` → all tokens expire → re-authenticate                    |
| **CLI storage**  | Token cached in `.techzblog/auth.json` (gitignored, file-permissions locked) |

> **Recommendation:** Start Phase 1 MVP. Move to JWT in the CLI's Phase 4 (Conflict/CI Hardening) when you need scoped access and automation.

---

## Vercel & Prisma Best Practices

A checklist to follow during implementation. Check each item as you build.

### Vercel Serverless

- [ ] **Keep functions lightweight** — each route handler does one thing (no monolith route files)
- [ ] **10s timeout on Hobby plan** — batch operations must limit payload size or process incrementally
- [ ] **Region co-location** — Vercel functions and Supabase DB should be in the same region (check Vercel project settings → Functions → Region)
- [ ] **Avoid heavy imports** — don't import the entire Prisma client namespace; tree-shake by importing only what's needed
- [ ] **Error boundaries in every route** — wrap all handlers in try/catch, return structured JSON errors
- [ ] **Use middleware** for cross-cutting concerns (auth check) instead of duplicating in each route
- [ ] **Cache headers** — admin API responses should have `Cache-Control: no-store` (no caching for mutations)
- [ ] **Environment variables** — all secrets in Vercel dashboard, never in code

### Prisma on Vercel

- [ ] **Singleton `PrismaClient`** — already done in `lib/prisma.ts` ✅
- [ ] **Connection pooler URL** — `DATABASE_URL` points to Supabase pooler (port 6543) ✅
- [ ] **Direct URL for migrations** — `DIRECT_URL` points to direct connection (port 5432) ✅
- [ ] **`prisma generate` in build** — already in build script ✅
- [ ] **Transaction mode** — Supabase pooler defaults to transaction mode (compatible with Prisma)
- [ ] **Connection limit awareness** — each serverless function invocation opens 1 connection through the pooler; Supabase Hobby allows up to 60 direct connections
- [ ] **Wrap multi-step mutations in `prisma.$transaction()`** — ensures atomicity for create-post-with-categories-and-tags

### Security

- [ ] **Bearer token validation on every admin route**
- [ ] **No admin routes exposed without auth**
- [ ] **Rate limiting** (can add later via Vercel Edge Middleware or Upstash)
- [ ] **Audit logging** — log every mutation with timestamp and affected slug
- [ ] **Input validation with Zod** — validate all incoming payloads before touching the DB

---

## Phase 0 — Branch & Scaffolding

**Duration:** ~30 minutes
**Goal:** Set up the branch, directory structure, and dependencies.

### Steps

1. Create the feature branch (commands in [Branch Strategy](#branch-strategy) above).

2. Create the directory structure:

   ```
   app/api/admin/
   ├── middleware.ts           (or use Next.js root middleware)
   └── posts/
       ├── route.ts            → POST (create), GET (list)
       ├── [slug]/
       │   ├── route.ts        → GET / PATCH / DELETE
       │   ├── publish/route.ts
       │   ├── unpublish/route.ts
       │   └── archive/route.ts
       └── sync/
           ├── diff/route.ts
           └── apply/route.ts
   ```

3. Install new dependencies:

   ```powershell
   npm install zod
   ```

   `zod` is needed for payload validation. Nothing else — Prisma, Next.js, and crypto APIs are already available.

4. Add new env vars to `.env.example`:

   ```env
   # Admin API authentication token
   # ADMIN_API_TOKEN="generate-with-node-crypto"
   ```

5. Commit the scaffolding:
   ```powershell
   git add .
   git commit -m "feat(admin-api): scaffold directory structure and deps"
   ```

---

## Phase 1 — Auth Middleware

**Duration:** ~1 hour
**Goal:** Create a reusable auth check function and integrate it.

### Files to create

#### `lib/admin-auth.ts`

```typescript
import { NextResponse } from "next/server";

export function validateAdminRequest(request: Request): NextResponse | null {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.ADMIN_API_TOKEN;

  if (!expected) {
    // Fail closed: if no token configured, reject all requests
    return NextResponse.json(
      { ok: false, error: "ADMIN_AUTH_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  if (!token || token !== expected) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  return null; // Auth passed
}
```

#### Usage pattern (in every admin route)

```typescript
import { validateAdminRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) return authError;

  // ... business logic
}
```

### Env var setup

1. Generate token: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Add to `.env`: `ADMIN_API_TOKEN="<generated-token>"`
3. Add to Vercel dashboard → Settings → Environment Variables → `ADMIN_API_TOKEN`

---

## Phase 2 — Single-Post CRUD Routes

**Duration:** ~1–2 days
**Goal:** Implement individual post create / read / update / delete.

### Files to create

#### `lib/admin/validation.ts`

Zod schemas for incoming payloads:

```typescript
import { z } from "zod";

export const createPostSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  excerpt: z.string().min(1),
  contentMdx: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  coverImage: z.string().url().nullable().optional(),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
  categories: z.array(z.string()).optional(), // category slugs
  tags: z.array(z.string()).optional(), // tag slugs
});

export const updatePostSchema = createPostSchema.partial().omit({ slug: true });
```

#### Route: `GET/POST /api/admin/posts`

| Method | Action                                  | Notes                               |
| ------ | --------------------------------------- | ----------------------------------- |
| `GET`  | List all posts with categories and tags | Supports `?status=DRAFT` filter     |
| `POST` | Create a new post                       | Upserts categories and tags by slug |

#### Route: `GET/PATCH/DELETE /api/admin/posts/[slug]`

| Method   | Action                  | Notes                                         |
| -------- | ----------------------- | --------------------------------------------- |
| `GET`    | Get single post by slug | Includes full MDX content                     |
| `PATCH`  | Update post fields      | Partial update, re-links categories/tags      |
| `DELETE` | Delete post             | Cascades to PostCategory/PostTag (via schema) |

### Key implementation details

- **Category/Tag upsert:** When CLI sends `categories: ["programming", "rust"]`, the route should:
  1. Find or create each category by slug.
  2. Disconnect old PostCategory links.
  3. Connect new ones.
  4. Same for tags.
- **Use `prisma.$transaction()`** for create/update to keep the post + relations atomic.
- **Call `revalidateTag()`** after every successful mutation (same tags as existing `/api/revalidate`).
- **Return a `revisionId`** (just `updatedAt` ISO string) so the CLI can track sync state.

---

## Phase 3 — Status Transitions

**Duration:** ~half day
**Goal:** Implement publish / unpublish / archive endpoints with validation.

### Files to create

- `app/api/admin/posts/[slug]/publish/route.ts`
- `app/api/admin/posts/[slug]/unpublish/route.ts`
- `app/api/admin/posts/[slug]/archive/route.ts`

### Validation rules

| Transition    | Rule                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| **Publish**   | `contentMdx` must not be empty. `publishedAt` is auto-set to `now()` if null. |
| **Unpublish** | Allowed from `PUBLISHED` only. Sets status to `DRAFT`.                        |
| **Archive**   | Allowed from any status. Sets status to `ARCHIVED`.                           |

Each route follows the same pattern:

1. Validate auth.
2. Find post by slug (404 if missing).
3. Validate transition rules.
4. Update status (and `publishedAt` if publishing).
5. Revalidate cache tags.
6. Return updated post.

---

## Phase 4 — Batch Sync Routes

**Duration:** ~1 day
**Goal:** Implement the diff and batch-apply endpoints for `techz push`.

### Files to create

- `app/api/admin/posts/sync/diff/route.ts`
- `app/api/admin/posts/sync/apply/route.ts`

### `POST /api/admin/posts/sync/diff`

**Request:**

```json
{
  "manifest": [
    { "slug": "intro-to-rust", "contentHash": "abc123", "updatedAt": "..." },
    { "slug": "new-post", "contentHash": "def456", "updatedAt": null }
  ]
}
```

**Response:**

```json
{
  "actions": [
    {
      "slug": "intro-to-rust",
      "action": "update",
      "reason": "content_changed"
    },
    { "slug": "new-post", "action": "create" },
    { "slug": "old-deleted-post", "action": "delete_remote" }
  ]
}
```

Logic: Compare local manifest hashes against DB `contentMdx` hashes. Flag creates/updates/deletes/noops.

### `POST /api/admin/posts/sync/apply`

**Request:**

```json
{
  "operations": [
    { "action": "create", "slug": "new-post", "data": { ... } },
    { "action": "update", "slug": "intro-to-rust", "data": { ... } },
    { "action": "delete", "slug": "old-post" }
  ]
}
```

**Response:**

```json
{
  "results": [
    { "slug": "new-post", "status": "ok", "revisionId": "..." },
    { "slug": "intro-to-rust", "status": "ok", "revisionId": "..." },
    { "slug": "old-post", "status": "ok" }
  ],
  "revalidated": ["blog:posts", "blog:categories", ...]
}
```

### ⚠️ Vercel Hobby Plan Timeout Strategy

The 10-second timeout on Hobby means you **cannot** process unlimited items in one request.

**Mitigation options (pick one):**

1. **CLI-side batching** — The CLI sends max 5 operations per request. Multiple sequential requests.
2. **Streaming response** — Not viable on Vercel serverless (no streaming for POST handlers on Hobby).
3. **Upgrade to Pro** — 60s timeout removes the concern entirely.

**Recommendation:** Option 1 — have the CLI's `--concurrency` flag default to `5` and send serial batches. Simpler and works on Hobby.

---

## Phase 5 — Hardening & Deployment

**Duration:** ~half day
**Goal:** Polish, error handling, and deploy to Vercel preview.

### Checklist

- [ ] All routes return structured error codes (`SLUG_CONFLICT`, `INVALID_PAYLOAD`, `NOT_FOUND`, etc.)
- [ ] Zod validation errors are formatted for CLI consumption
- [ ] All mutations are wrapped in `try/catch` with proper HTTP status codes
- [ ] `Cache-Control: no-store` header on all admin responses
- [ ] Audit log: `console.log` structured JSON for every mutation (Vercel captures these)
- [ ] Update `.env.example` with all new env vars
- [ ] Test all routes locally with `curl` or Postman

### Deploy to Vercel Preview

```powershell
# Push the branch — Vercel auto-creates a Preview Deployment
git push origin feat/admin-api
```

The preview deployment URL lets you test all routes against real serverless functions before merging.

---

## Phase 6 — Verification & Merge

**Duration:** ~half day
**Goal:** Verify everything works on the Vercel preview deployment, then merge.

### Verification steps

1. **Health check:** `curl -H "Authorization: Bearer <token>" https://<preview-url>/api/admin/posts`
2. **Create a test post:** POST with full payload, verify it appears in DB.
3. **Update the post:** PATCH with partial data, verify changes.
4. **Publish the post:** POST to `/publish`, verify `publishedAt` is set and status changes.
5. **Diff check:** POST manifest to `/sync/diff`, verify correct action detection.
6. **Delete the test post:** DELETE, verify cascade behavior.
7. **Auth failure:** Send request without token, verify 401 response.
8. **Invalid payload:** Send malformed data, verify Zod error response.

### Merge to master

```powershell
# Switch to master and merge
git checkout master
git merge feat/admin-api

# Push to trigger production deployment
git push origin master

# Clean up
git branch -d feat/admin-api
```

### Post-merge

- [ ] Set `ADMIN_API_TOKEN` in Vercel **Production** environment variables
- [ ] Verify production routes work with the token
- [ ] Start building Phase 1 of the CLI (separate repository)

---

## Quick Reference: All New Files

```
lib/
├── admin-auth.ts              # Bearer token validation
└── admin/
    └── validation.ts          # Zod schemas for payloads

app/api/admin/posts/
├── route.ts                   # GET (list) + POST (create)
├── [slug]/
│   ├── route.ts               # GET + PATCH + DELETE
│   ├── publish/route.ts       # POST
│   ├── unpublish/route.ts     # POST
│   └── archive/route.ts       # POST
└── sync/
    ├── diff/route.ts          # POST
    └── apply/route.ts         # POST
```

## Quick Reference: New Environment Variables

| Variable          | Where                               | Purpose                  |
| ----------------- | ----------------------------------- | ------------------------ |
| `ADMIN_API_TOKEN` | Vercel Dashboard + local `.env`     | Admin API authentication |
| `JWT_SECRET`      | Vercel Dashboard (Phase 2 JWT only) | JWT signing key (future) |

---

_Plan date: 2026-03-02 — Aligned with `external-cli-content-sync-plan.md`_
