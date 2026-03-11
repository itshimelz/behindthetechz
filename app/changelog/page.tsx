import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Recent updates and improvements to behind the TechZ blog.",
};

export default function ChangelogPage() {
  const filePath = path.join(process.cwd(), "content", "CHANGELOG.md");
  const source = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote
            source={source}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
