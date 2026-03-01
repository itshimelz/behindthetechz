# 🚀 behindTheTechz

behindTheTechz is a modern, high-performance blog platform designed for interlinked content. It combines the simplicity of Markdown with the power of a digital garden, featuring an interactive graph visualization of your knowledge base.

![behindTheTechz Banner](https://placehold.co/1200x400/0f172a/ffffff?text=behindTheTechz+Digital+Garden)

## ✨ Features

- **🕸️ Interactive Graph View**: Visualize connections between posts in a 2D force-directed graph.
- **📝 DB-Backed Content**: Posts are served directly from PostgreSQL via Prisma.
- **📓 Notion-Style Sidebar**: A clean, collapsible sidebar for easy navigation through categories and favorite posts.
- **🔍 Smart Search**: Instant search and filtering to find exactly what you're looking for.
- **🎨 Stunning Aesthetics**: Modern design with glassmorphism, smooth animations, and a focus on readability.
- **🔢 Math & Code**: First-class support for KaTeX math blocks and Shiki-powered syntax highlighting.
- **🇧🇩 Bengali Support**: Optimized typography and interlinking specifically for Bengali language content.
- **⭐ Post Favorites**: Save and easily access your favorite articles locally.
- **📱 Fully Responsive**: Thoughtfully adjusted layouts to ensure a seamless experience across mobile and desktop.
- **☁️ Scalable Media**: Integrated Supabase storage for fast and reliable image/file hosting.
- **🚀 Analytics & Monitoring**: Deployed on Vercel with integrated Speed Insights and Analytics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Visuals**: [React Force Graph](https://github.com/vasturiano/react-force-graph)
- **Icons**: [Hugeicons](https://hugeicons.com/)
- **Content Rendering**: [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Database & Storage**: [Supabase](https://supabase.com/) (Postgres + Storage buckets)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Typography**: Geist Sans & Geist Mono

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/behindthetechz.git
   cd behindthetechz
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
- `/scripts/backup-db-posts.mjs`: DB JSON backup script.
- `/lib`: Utility functions and shared logic.
- `/hooks`: Custom React hooks.

## Database Operations

- Export DB snapshot: `npm run db:backup:json`

## Cache Revalidation

- Endpoint: `POST /api/revalidate`
- Protect with `REVALIDATE_SECRET` (optional)

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

---

Built with ❤️ for the Bangladeshi developer community.
