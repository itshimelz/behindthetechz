# Blog Post Management Plan

## Objective
Define a clear operational workflow to create, review, publish, update, and retire blog posts once content is database-driven.

## Scope
- Editorial workflow
- Admin capabilities
- Quality checks
- SEO governance
- Backup and recovery

---

## Operating Model
- **Primary role:** Author (Rahat) with optional future roles (Editor/Admin)
- **Content states:** `draft -> in_review -> scheduled -> published -> archived`
- **Source of truth:** Database post record + revision history

---

## Phase-by-Phase Plan

## Phase 1 - Editorial Rules and Content Standards

### Goal
Set consistent standards before building admin tooling.

### Tasks
- Define required fields:
  - title, slug, excerpt, contentMdx, category, tags, status
- Define writing standards:
  - Bangla-first tone for posts
  - technical terms preserved in English where appropriate
- Define slug policy:
  - lowercase, hyphenated, immutable after publish (or redirect required)
- Define image policy:
  - naming convention, alt text requirement, recommended dimensions

### Deliverables
- Written editorial checklist for every post.

### Definition of Done
- New post quality criteria are documented and repeatable.

---

## Phase 2 - Admin Interface (Internal CMS)

### Goal
Create internal tools to manage posts without touching code files.

### Tasks
- Build protected admin routes (`/admin/*`) with authentication.
- Add post CRUD UI:
  - create/edit/delete draft
  - preview MDX render
  - publish/unpublish/schedule
- Add taxonomy management:
  - categories, tags (create/merge/retire)
- Add filters/search for status, tag, category, date.

### Deliverables
- Usable internal CMS for day-to-day publishing.

### Definition of Done
- Author can publish and update posts from browser only.

---

## Phase 3 - Workflow Automation and Validation

### Goal
Reduce publishing mistakes with automatic validation.

### Tasks
- Add server-side validation rules:
  - unique slug
  - required fields present
  - min excerpt/body lengths
- Add content lint checks:
  - broken internal wiki links
  - missing image alt text
  - malformed MDX blocks
- Add pre-publish checklist gate in admin UI.

### Deliverables
- Validation system that blocks incomplete/invalid posts.

### Definition of Done
- Failed validation returns actionable messages before publish.

---

## Phase 4 - Publishing Operations

### Goal
Standardize how posts go live and how updates are handled.

### Tasks
- Support scheduled publishing with timezone-aware `publishedAt`.
- Add revalidation trigger on publish/update/archive.
- Add redirect flow when slug changes (if allowed).
- Add “major update” marker for refreshed posts (`updatedAt`).

### Deliverables
- Predictable go-live process with minimal manual steps.

### Definition of Done
- Publish/update actions reflect on public site quickly and reliably.

---

## Phase 5 - Governance, Security, and Recovery

### Goal
Protect content integrity and access.

### Tasks
- Add role-based access:
  - Admin: full access
  - Editor: create/edit/publish
  - Author: create/edit own drafts
- Add audit logs for create/update/delete/publish actions.
- Add revision history and rollback for posts.
- Schedule automatic database backups and restoration drills.

### Deliverables
- Secure, recoverable content operations.

### Definition of Done
- Changes are attributable, reversible, and protected.

---

## Phase 6 - Analytics and Content Lifecycle

### Goal
Manage posts as a long-term content product.

### Tasks
- Add content performance dashboard:
  - views, read time, top tags/categories
- Add stale-content review workflow (e.g., review every 6 months).
- Add archive policy for outdated posts.
- Maintain evergreen post list for periodic updates.

### Deliverables
- Continuous improvement loop for published content.

### Definition of Done
- Team can decide what to update, archive, or expand based on data.

---

## Practical Weekly Workflow (Suggested)
- Monday: draft or update one post
- Tuesday: review + validation fixes
- Wednesday: schedule/publish
- Thursday: promote and monitor early feedback
- Friday: analytics review + backlog planning

---

## Management KPIs
- Draft-to-publish cycle time
- Publishing frequency per month
- Percentage of posts with full metadata
- Broken link rate
- Percentage of posts reviewed in last 6 months
