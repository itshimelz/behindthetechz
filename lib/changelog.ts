export type ChangelogItemType = "feature" | "improvement" | "fix" | "launch";

export type ChangelogItem = {
  text: string;
  detail?: string;
};

export type ChangelogSection = {
  type: ChangelogItemType;
  label: string;
  items: ChangelogItem[];
};

export type ChangelogEntry = {
  date: string;
  version?: string;
  sections: ChangelogSection[];
};

export function dateToId(date: string): string {
  return date.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "April 2026",
    sections: [
      {
        type: "improvement",
        label: "Improvements",
        items: [
          {
            text: "Table of Contents — Full heading support",
            detail:
              "TOC now includes all heading levels (H1–H6) instead of only H2 and H3. Indentation and sizing scale automatically per depth.",
          },
          {
            text: "TOC — Section title flicker on navigation",
            detail:
              "Clicking a TOC item or navigation arrow now briefly animates the target heading with a color-and-glow flicker effect. Respects prefers-reduced-motion.",
          },
          {
            text: "TOC — Accurate heading ID generation",
            detail:
              "Replaced the custom slug function with github-slugger so TOC IDs always match the rendered HTML anchors from rehype-slug, fixing scroll mismatches on non-ASCII headings.",
          },
          {
            text: "About Author modal — Full redesign",
            detail:
              "Rebuilt the author dialog with a structured hero panel, bio block, social link cards (GitHub, X, LinkedIn, Facebook), and an info snapshot section.",
          },
        ],
      },
      {
        type: "feature",
        label: "New Features",
        items: [
          {
            text: "Post Scroll Memory",
            detail:
              "The blog now remembers where you left off on each post. On return, the page silently restores your scroll position using sessionStorage — no server, no database. Togglable from Reading Preferences.",
          },
        ],
      },
    ],
  },
  {
    date: "March 11, 2026",
    sections: [
      {
        type: "feature",
        label: "New Features",
        items: [
          {
            text: "Table of Contents",
            detail:
              "Posts with multiple headings now show a navigable TOC with active section highlighting.",
          },
          {
            text: "Related Posts",
            detail:
              "Each post now suggests up to 3 related articles based on shared tags and categories.",
          },
          {
            text: "Tags Page",
            detail:
              "Browse all tags at /tags and view posts per tag at /tags/{slug} with color-coded badges.",
          },
          {
            text: "RSS Feed",
            detail: "Subscribe to the blog via RSS at /feed.xml.",
          },
          {
            text: "Post Series",
            detail:
              "Group related posts into ordered series with in-post navigation.",
          },
          {
            text: "View Count",
            detail: "Posts now display view counts, tracked per visit.",
          },
          {
            text: "Changelog Page",
            detail: "You're reading it right now.",
          },
          {
            text: "CLI Image Uploading",
            detail:
              "Batch upload local images directly to Supabase via the CLI using `techz image upload`.",
          },
        ],
      },
      {
        type: "improvement",
        label: "Improvements",
        items: [
          {
            text: "Reading time on all post cards",
          },
          {
            text: "Date and reading time styled in italic for a cleaner look",
          },
          {
            text: '"Last Updated" badge on significantly revised posts',
          },
          {
            text: "Copy post link button on hover for post cards",
          },
          {
            text: "TOC Redesign — Desktop visual hierarchy with circular nav arrows and precise active-state tracking",
          },
          {
            text: "Mobile TOC UX — Replaced inline TOC with a floating pill button and smooth bottom-sheet overlay",
          },
          {
            text: "Related Posts Design — Edge-to-edge images and aesthetic placeholders",
          },
          {
            text: "Typography — Tweaked blog post line gaps for enhanced readability on large screens",
          },
          {
            text: "Custom Favicon — Updated the site's default favicon",
          },
        ],
      },
      {
        type: "fix",
        label: "Bug Fixes",
        items: [
          {
            text: "TOC Scroll Bug — Fixed clicking TOC links not scrolling accurately due to sticky headers",
          },
          {
            text: "CLI Upload Bug — Fixed INVALID_FORM_DATA parsing errors for multipart image uploads",
          },
          {
            text: "Sync Route — Resolved revalidateTag expected argument error in the admin post sync route",
          },
        ],
      },
    ],
  },
  {
    date: "February 2026",
    sections: [
      {
        type: "launch",
        label: "Launch",
        items: [
          {
            text: "Initial launch of behind the TechZ",
          },
          {
            text: "Blog with MDX content, categories, tags, and graph view",
          },
          {
            text: "Dark/light theme with localStorage persistence",
          },
          {
            text: "Favorites system with cross-tab sync",
          },
          {
            text: "Share dialog with X, Facebook, LinkedIn, WhatsApp, Telegram, and Email",
          },
          {
            text: "Wiki-style [[slug]] interlinking with backlinks",
          },
          {
            text: "Reading progress bar and scroll-to-top",
          },
          {
            text: "SEO — Open Graph, Twitter cards, sitemap, robots.txt",
          },
        ],
      },
    ],
  },
];
