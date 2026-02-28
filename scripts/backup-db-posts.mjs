import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

function toTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function main() {
  const outputDir = path.join(process.cwd(), "backups");
  const fileName = `blog-db-backup-${toTimestamp()}.json`;
  const filePath = path.join(outputDir, fileName);

  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      categories: {
        orderBy: { assignedAt: "asc" },
        include: { category: true },
      },
      tags: {
        include: { tag: true },
      },
    },
  });

  const snapshot = {
    exportedAt: new Date().toISOString(),
    totalPosts: posts.length,
    publishedPosts: posts.filter((post) => post.status === PostStatus.PUBLISHED)
      .length,
    draftPosts: posts.filter((post) => post.status === PostStatus.DRAFT).length,
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      contentMdx: post.contentMdx,
      coverImage: post.coverImage,
      status: post.status,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.categories.map((entry) => ({
        name: entry.category.name,
        slug: entry.category.slug,
        iconKey: entry.category.iconKey,
      })),
      tags: post.tags.map((entry) => ({
        name: entry.tag.name,
        slug: entry.tag.slug,
      })),
    })),
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf-8");

  console.log(`Backup created: ${filePath}`);
  console.log(`Posts exported: ${snapshot.totalPosts}`);
}

main()
  .catch((error) => {
    console.error("Backup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
