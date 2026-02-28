# 🚀 Techzblog

Techzblog is a modern, high-performance blog platform designed for interlinked content. It combines the simplicity of Markdown with the power of a digital garden, featuring an interactive graph visualization of your knowledge base.

![Techzblog Banner](https://placehold.co/1200x400/0f172a/ffffff?text=Techzblog+Digital+Garden)

## ✨ Features

- **🕸️ Interactive Graph View**: Visualize connections between posts in a 2D force-directed graph.
- **📝 DB-Backed MDX Content**: Author in MDX, then sync to PostgreSQL via Prisma for runtime delivery.
- **📓 Notion-Style Sidebar**: A clean, collapsible sidebar for easy navigation through categories and favorite posts.
- **🔍 Smart Search**: Instant search and filtering to find exactly what you're looking for.
- **🎨 Stunning Aesthetics**: Modern design with glassmorphism, smooth animations, and a focus on readability.
- **🔢 Math & Code**: First-class support for KaTeX math blocks and Shiki-powered syntax highlighting.
- **🇧🇩 Bengali Support**: Optimized typography and interlinking specifically for Bengali language content.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Visuals**: [React Force Graph](https://github.com/vasturiano/react-force-graph)
- **Icons**: [Hugeicons](https://hugeicons.com/)
- **Content**: [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) & [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Database/ORM**: [Supabase Postgres](https://supabase.com/) + [Prisma](https://www.prisma.io/)
- **Typography**: Geist Sans & Geist Mono

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/techzblog.git
   cd techzblog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components (Sidebar, Graph, Blog cards, etc.).
- `/content/posts`: MDX files containing the blog content.
- `/scripts/import-mdx-to-prisma.mjs`: MDX -> DB sync/import script.
- `/lib`: Utility functions and shared logic.
- `/hooks`: Custom React hooks.

## Database Content Workflow

- Import MDX to DB: `npm run db:import-mdx`
- Import + prune stale DB rows: `npm run db:import-mdx:prune`
- Dry-run import: `npm run db:import-mdx:dry`
- Dry-run import + prune: `npm run db:import-mdx:prune:dry`

## Cache Revalidation

- Endpoint: `POST /api/revalidate`
- Protect with `REVALIDATE_SECRET` (optional)
- Import script can auto-trigger revalidation when `REVALIDATE_URL` is set

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

---

Built with ❤️ for the Bangladeshi developer community.
