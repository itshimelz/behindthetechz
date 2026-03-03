# 📝 Post Authoring Guide — behindTheTechz

This guide explains how to create blog posts (both English and Bengali) and how slugs, wikilinks, and categories work in the system.

---

## ✅ Bengali Slug Support — Fully Supported

Your project **natively supports Bengali (বাংলা) slugs** in URLs, wikilinks, and categories. No code changes are needed.

### How It Works

| Layer                 | Bengali Support | How                                                                                 |
| --------------------- | --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Next.js Routes**    | ✅              | `decodeURIComponent(slug)` in both `/blog/[slug]` and `/categories/[slug]`          |
| **Prisma / Database** | ✅              | `slug` is stored as a plain `String` in PostgreSQL — no ASCII restriction           |
| **Wikilinks**         | ✅              | Regex `[^\]                                                                         | ]+` matches **any** Unicode character, including Bengali |
| **Backlinks & Graph** | ✅              | `extractWikiLinkSlugs()` also uses the same Unicode-compatible regex                |
| **Sitemap & SEO**     | ✅              | `generateStaticParams` pulls all slugs — Bengali ones get URL-encoded automatically |

### Example URLs

```
English:  /blog/intro-to-rust
Bengali:  /blog/কোটলিন-পরিচিতি
Mixed:    /blog/kotlin-পরিচিতি
```

Browsers auto-encode Bengali characters to percent-encoded format (e.g., `%E0%A6%95%E0%...`) in the address bar, but Next.js decodes them back via `decodeURIComponent`.

---

## 📖 How to Write a New Post

Posts are stored in the **PostgreSQL** database (via Supabase) and managed through Prisma. You can insert them via **Prisma Studio** or directly through SQL.

### Required Fields

| Field          | Type              | Description                                             |
| -------------- | ----------------- | ------------------------------------------------------- |
| `slug`         | `String` (unique) | URL-safe identifier. Can be Bengali, English, or mixed. |
| `title`        | `String`          | Display title of the post (can be Bengali).             |
| `excerpt`      | `String`          | Short description shown in previews.                    |
| `content_mdx`  | `Text`            | Full post content in MDX format.                        |
| `status`       | `PostStatus`      | `DRAFT`, `PUBLISHED`, or `ARCHIVED`.                    |
| `published_at` | `DateTime?`       | Publication date (set when publishing).                 |

### Optional Fields

| Field         | Type      | Description                                    |
| ------------- | --------- | ---------------------------------------------- |
| `cover_image` | `String?` | URL to the cover image (use Supabase Storage). |
| `is_featured` | `Boolean` | Highlight on the home page. Default: `false`.  |

---

## 🔗 Using Wikilinks in MDX Content

Wikilinks create internal connections between posts, powering the **Graph View** and **Backlinks** features.

### Syntax

```mdx
<!-- Link to another post by its slug -->

[[intro-to-rust]]

<!-- Link with custom display text -->

[[intro-to-rust|রাস্ট ভাষা শিখুন]]

<!-- Bengali slug -->

[[কোটলিন-পরিচিতি]]

<!-- Bengali slug with display text -->

[[কোটলিন-পরিচিতি|কোটলিন কী?]]
```

### What They Produce

| Syntax                           | Result                                              |
| -------------------------------- | --------------------------------------------------- |
| `[[intro-to-rust]]`              | `<a href="/blog/intro-to-rust">intro-to-rust</a>`   |
| `[[intro-to-rust\|রাস্ট শিখুন]]` | `<a href="/blog/intro-to-rust">রাস্ট শিখুন</a>`     |
| `[[কোটলিন-পরিচিতি]]`             | `<a href="/blog/কোটলিন-পরিচিতি">কোটলিন-পরিচিতি</a>` |
| `[[কোটলিন-পরিচিতি\|কোটলিন কী?]]` | `<a href="/blog/কোটলিন-পরিচিতি">কোটলিন কী?</a>`     |

> **Tip:** For Bengali display text with English slugs, use the pipe `|` syntax. This keeps URLs clean while showing Bengali to readers.

---

## 🏷️ Categories and Tags

Categories and tags are separate database tables linked to posts via junction tables.

### Creating a Category

Insert into the `categories` table:

```sql
INSERT INTO categories (id, name, slug, icon_key)
VALUES (gen_random_uuid(), 'প্রোগ্রামিং', 'প্রোগ্রামিং', 'programming');
```

### Assigning a Category to a Post

Insert into `post_categories`:

```sql
INSERT INTO post_categories (post_id, category_id)
VALUES ('<post-uuid>', '<category-uuid>');
```

> Bengali category slugs work the same way as post slugs — they are decoded on the frontend.

---

## 📝 Example: Complete Bengali Post

### Step 1: Insert the Post

```sql
INSERT INTO posts (id, slug, title, excerpt, content_mdx, status, published_at)
VALUES (
  gen_random_uuid(),
  'কোটলিন-পরিচিতি',
  'কোটলিন পরিচিতি',
  'কোটলিন প্রোগ্রামিং ভাষার একটি সহজ পরিচিতি।',
  '# কোটলিন পরিচিতি

কোটলিন হলো একটি আধুনিক প্রোগ্রামিং ভাষা যা **JetBrains** তৈরি করেছে।

## কেন কোটলিন?

- সহজ সিনট্যাক্স
- নাল সেফটি
- জাভার সাথে ইন্টারঅপারেবল

আরও জানতে পড়ুন [[intro-to-rust|রাস্ট ভাষা]] এবং [[kmp-basics|KMP বেসিকস]]।
  ',
  'PUBLISHED',
  NOW()
);
```

### Step 2: Link to a Category

```sql
INSERT INTO post_categories (post_id, category_id)
VALUES ('<post-uuid>', '<programming-category-uuid>');
```

### Step 3: Add Tags

```sql
INSERT INTO post_tags (post_id, tag_id)
VALUES ('<post-uuid>', '<kotlin-tag-uuid>');
```

---

## 🧭 Slug Best Practices

| Practice                                                    | Example                                             |
| ----------------------------------------------------------- | --------------------------------------------------- |
| Use hyphens to separate words                               | `কোটলিন-পরিচিতি` ✅ / `কোটলিন পরিচিতি` ❌           |
| Keep slug lowercase                                         | `intro-to-rust` ✅ / `Intro-To-Rust` ❌             |
| Bengali slugs use Bengali script, no transliteration needed | `কোটলিন-পরিচিতি` ✅ / `kotlin-porichiti` ❌         |
| For mixed posts, pick one language for the slug             | `kotlin-পরিচিতি` works but is less clean            |
| Always match the wikilink text exactly with the stored slug | `[[কোটলিন-পরিচিতি]]` must match the DB slug exactly |

---

## 🛠️ Tools for Managing Posts

| Tool                 | Command                                                   |
| -------------------- | --------------------------------------------------------- |
| **Prisma Studio**    | `npm run prisma:studio` — visual DB editor                |
| **Backup**           | `npm run db:backup:json` — export posts as JSON           |
| **Revalidate Cache** | `POST /api/revalidate` — clear cached pages after changes |
