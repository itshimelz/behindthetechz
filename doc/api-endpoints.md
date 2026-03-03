# API Endpoints Documentation

This document outlines all the accessible API endpoints in the application, mostly located under `app/api/`.

## 1. Cache Revalidation

### `POST /api/revalidate`

- **Description:** Revalidates Next.js cache tags.
- **Authentication:** Requires a secret token provided via the `x-revalidate-token` header or the `secret` query parameter.
- **Payload:**
  ```json
  { "tags": ["tag1", "tag2"] } // Optional
  ```
  If no tags are provided, it revalidates the default blog cache tags.

---

## 2. Admin Posts Management

_(All admin routes require standard admin authentication via the `validateAdminRequest` utility)_

### `GET /api/admin/posts`

- **Description:** Retrieve a list of all posts.
- **Query Parameters:** `?status=DRAFT|PUBLISHED|ARCHIVED` (Optional)
- **Returns:** An array of post objects mapping their `id`, `slug`, `title`, `status`, etc.

### `POST /api/admin/posts`

- **Description:** Create a new post.
- **Payload:** `createPostSchema` which includes fields like `slug`, `title`, `excerpt`, `contentMdx`, `status`, `coverImage`, `isFeatured`, `publishedAt`, `categories`, and `tags`.
- **Returns:** The newly created post.

### `GET /api/admin/posts/[slug]`

- **Description:** Retrieve a single post with full content.
- **Parameters:** `slug` (Path parameter)
- **Returns:** The detailed post object including `categories` and `tags`.

### `PATCH /api/admin/posts/[slug]`

- **Description:** Partially update an existing post.
- **Parameters:** `slug` (Path parameter)
- **Payload:** `updatePostSchema` (Any subset of post fields to be updated).
- **Returns:** The updated post.

### `DELETE /api/admin/posts/[slug]`

- **Description:** Delete a post. This operation cascades and also removes category/tag linkages.
- **Parameters:** `slug` (Path parameter)
- **Returns:** Status confirmation and the deleted slug.

---

## 3. Post State Transitions

### `POST /api/admin/posts/[slug]/publish`

- **Description:** Publish a post. The post must have non-empty `contentMdx`.
- **Parameters:** `slug` (Path parameter)
- **Returns:** The updated post with `status: "PUBLISHED"`.

### `POST /api/admin/posts/[slug]/unpublish`

- **Description:** Revert a published post back to draft. The post must currently be in the `PUBLISHED` state.
- **Parameters:** `slug` (Path parameter)
- **Returns:** The updated post with `status: "DRAFT"`.

### `POST /api/admin/posts/[slug]/archive`

- **Description:** Archive a post from any current status.
- **Parameters:** `slug` (Path parameter)
- **Returns:** The updated post with `status: "ARCHIVED"`.

---

## 4. Post Synchronization

### `POST /api/admin/posts/sync/diff`

- **Description:** Compare a local manifest of posts against the database to determine required actions.
- **Payload:** `syncManifestSchema`
  ```json
  {
    "manifest": [
      { "slug": "post-slug", "contentHash": "sha256-hash-of-content" }
    ]
  }
  ```
- **Returns:** An array of required actions (`create`, `update`, `noop`, or `delete_remote`).

### `POST /api/admin/posts/sync/apply`

- **Description:** Batch apply actions (create, update, delete) for post synchronization within a single transaction.
- **Payload:** `syncApplySchema`
  ```json
  {
    "operations": [
      { "action": "create|update|delete", "slug": "post-slug", "data": {} }
    ]
  }
  ```
- **Returns:** Results of each operation and the revalidated cache tags.
