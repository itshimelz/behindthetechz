// Type declarations for CSS imports (both module and side-effect)
declare module "*.css" {
  const content: Record<string, never>;
  export default content;
}

declare module "katex/dist/katex.min.css" {}

declare module "katex/dist/katex.min.css" {}

// Side-effect CSS imports (no default export needed)
declare module "katex/dist/katex.min.css" {}
