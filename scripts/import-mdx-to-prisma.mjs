import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORY_ICON_KEYS = new Set([
  "tag",
  "programming",
  "development",
  "design",
  "productivity",
  "graph",
]);

function inferCategoryIconKey(categoryName) {
  const normalized = String(categoryName).toLowerCase();

  if (
    normalized.includes("programming") ||
    normalized.includes("technology") ||
    normalized.includes("প্রোগ্রামিং")
  ) {
    return "programming";
  }

  if (normalized.includes("development")) {
    return "development";
  }

  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux")) {
    return "design";
  }

  if (
    normalized.includes("productivity") ||
    normalized.includes("pkm") ||
    normalized.includes("focus")
  ) {
    return "productivity";
  }

  if (
    normalized.includes("math") ||
    normalized.includes("গণিত") ||
    normalized.includes("ml") ||
    normalized.includes("ai") ||
    normalized.includes("data")
  ) {
    return "graph";
  }

  return "tag";
}

function resolveCategoryIconKey(rawValue, categoryName) {
  const normalized = toStringOrEmpty(rawValue).toLowerCase();
  if (normalized && CATEGORY_ICON_KEYS.has(normalized)) {
    return normalized;
  }

  return inferCategoryIconKey(categoryName);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toStringOrEmpty(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toBoolean(value) {
  return value === true;
}

function parseDate(value, fallback) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
}

async function upsertPostFromFile(filePath, dryRun) {
  const source = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(source);
  const fileSlug = path.basename(filePath, ".mdx");
  const now = new Date();

  const slug = toStringOrEmpty(data.slug) || fileSlug;
  const title = toStringOrEmpty(data.title) || fileSlug;
  const excerpt = toStringOrEmpty(data.excerpt);
  const coverImage = toStringOrEmpty(data.coverImage) || null;
  const categoryName = toStringOrEmpty(data.category) || "Uncategorized";
  const categorySlug = slugify(categoryName) || "uncategorized";
  const categoryIconKey = resolveCategoryIconKey(
    data.categoryIconKey ?? data.categoryIcon,
    categoryName,
  );
  const tags = Array.isArray(data.tags)
    ? [...new Set(data.tags.map((tag) => toStringOrEmpty(tag)).filter(Boolean))]
    : [];
  const featured = toBoolean(data.featured);
  const draft = toBoolean(data.draft);
  const status = draft ? PostStatus.DRAFT : PostStatus.PUBLISHED;
  const publishedAt = parseDate(data.date, now);
  const updatedAt = parseDate(data.updatedAt, publishedAt);

  if (dryRun) {
    return {
      slug,
      created: false,
      updated: false,
      category: categoryName,
      tagCount: tags.length,
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    const category = await tx.category.upsert({
      where: { slug: categorySlug },
      create: {
        slug: categorySlug,
        name: categoryName,
        iconKey: categoryIconKey,
      },
      update: {
        name: categoryName,
        iconKey: categoryIconKey,
      },
    });

    const post = await tx.post.upsert({
      where: { slug },
      create: {
        slug,
        title,
        excerpt,
        contentMdx: content,
        coverImage,
        isFeatured: featured,
        status,
        publishedAt,
        createdAt: publishedAt,
        updatedAt,
      },
      update: {
        title,
        excerpt,
        contentMdx: content,
        coverImage,
        isFeatured: featured,
        status,
        publishedAt,
        updatedAt,
      },
      select: { id: true },
    });

    await tx.postCategory.deleteMany({ where: { postId: post.id } });
    await tx.postCategory.create({
      data: {
        postId: post.id,
        categoryId: category.id,
      },
    });

    await tx.postTag.deleteMany({ where: { postId: post.id } });
    for (const tagName of tags) {
      const tagSlug = slugify(tagName);
      if (!tagSlug) continue;

      const tag = await tx.tag.upsert({
        where: { slug: tagSlug },
        create: {
          slug: tagSlug,
          name: tagName,
        },
        update: {
          name: tagName,
        },
      });

      await tx.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      });
    }

    return {
      slug,
      created: !existing,
      updated: Boolean(existing),
      category: categoryName,
      tagCount: tags.length,
    };
  }, {
    timeout: 20000,
    maxWait: 10000,
  });
}

async function triggerRevalidation() {
  const revalidateUrl = process.env.REVALIDATE_URL;
  if (!revalidateUrl) return;

  try {
    const headers = {
      "content-type": "application/json",
    };

    if (process.env.REVALIDATE_SECRET) {
      headers["x-revalidate-token"] = process.env.REVALIDATE_SECRET;
    }

    const response = await fetch(revalidateUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tags: [
          "blog:posts",
          "blog:categories",
          "blog:tags",
          "blog:backlinks",
          "blog:graph",
        ],
      }),
    });

    if (!response.ok) {
      console.warn(`Revalidation request failed with status ${response.status}`);
      return;
    }

    console.log(`Revalidated cache via ${revalidateUrl}`);
  } catch (error) {
    console.warn("Failed to trigger cache revalidation:", error);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const prune = process.argv.includes("--prune");
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = (await fs.readdir(postsDir))
    .filter((file) => file.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.log("No MDX files found in content/posts.");
    return;
  }

  let createdCount = 0;
  let updatedCount = 0;
  const sourceSlugs = new Set();

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const result = await upsertPostFromFile(filePath, dryRun);
    sourceSlugs.add(result.slug);

    if (result.created) createdCount += 1;
    if (result.updated) updatedCount += 1;

    console.log(
      `${dryRun ? "[dry-run]" : "[sync]"} ${result.slug} | category: ${result.category} | tags: ${result.tagCount}`,
    );
  }

  let prunedPosts = 0;
  let prunedCategories = 0;
  let prunedTags = 0;

  if (prune) {
    const slugs = [...sourceSlugs];

    if (dryRun) {
      const missingPostWhere =
        slugs.length > 0 ? { slug: { notIn: slugs } } : undefined;

      prunedPosts = await prisma.post.count({ where: missingPostWhere });
      prunedCategories = await prisma.category.count({
        where: {
          posts: {
            none: {},
          },
        },
      });
      prunedTags = await prisma.tag.count({
        where: {
          posts: {
            none: {},
          },
        },
      });
    } else {
      const postDeleteResult =
        slugs.length > 0
          ? await prisma.post.deleteMany({ where: { slug: { notIn: slugs } } })
          : await prisma.post.deleteMany();
      prunedPosts = postDeleteResult.count;

      const categoryDeleteResult = await prisma.category.deleteMany({
        where: {
          posts: {
            none: {},
          },
        },
      });
      prunedCategories = categoryDeleteResult.count;

      const tagDeleteResult = await prisma.tag.deleteMany({
        where: {
          posts: {
            none: {},
          },
        },
      });
      prunedTags = tagDeleteResult.count;
    }
  }

  console.log(
    `${dryRun ? "Dry-run complete" : "Import complete"}. Files: ${files.length}, created: ${createdCount}, updated: ${updatedCount}`,
  );

  if (prune) {
    console.log(
      `${dryRun ? "Dry-run prune" : "Prune complete"}. posts: ${prunedPosts}, categories: ${prunedCategories}, tags: ${prunedTags}`,
    );
  }

  if (!dryRun) {
    await triggerRevalidation();
  }
}

main()
  .catch((error) => {
    console.error("MDX import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
