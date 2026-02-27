# AGENTS.md

## Purpose
This file gives coding agents a fast, reliable way to work in this repository without breaking conventions.

## Project Snapshot
- Framework: Next.js `16` with App Router (`app/` directory)
- Language: TypeScript + React `19`
- Styling: Tailwind CSS `v4` + `tw-animate-css` + shadcn styling (`base-nova` preset)
- Component primitives: `@base-ui/react`
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons`
- Package manager: `npm` (lockfile is `package-lock.json`)

## Repository Layout
- `app/layout.tsx`: root layout, fonts, global metadata
- `app/page.tsx`: home page entry
- `app/globals.css`: design tokens, theme variables, global Tailwind layers
- `components/ui/*`: reusable UI primitives
- `lib/utils.ts`: shared `cn()` class merge helper
- `components.json`: shadcn generator and alias configuration

## Runbook
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Build production bundle: `npm run build`
- Start production server: `npm run start`

## Code Style and Conventions
- Use TypeScript and functional React components.
- Follow existing formatting in edited files (do not reformat unrelated code).
- Keep imports grouped logically:
  1) external packages,
  2) internal aliases like `@/components/*` and `@/lib/*`.
- Reuse `cn()` from `lib/utils.ts` for class name composition.
- Keep UI component APIs consistent with existing `data-slot` and variant patterns.
- Prefer small focused changes over broad refactors.

## UI and Styling Conventions
- Prefer Tailwind utility classes over ad hoc CSS files.
- Use theme tokens from `app/globals.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.) instead of hardcoded colors.
- Preserve the existing component composition style in `components/ui/*`.
- When adding interactive components, keep client/server boundaries explicit (`"use client"` only where required).

## Next.js Client/Server Boundary Rules
- Treat files in `app/*` as Server Components by default unless they start with `"use client"`.
- Never call functions imported from client-only modules (files with `"use client"`) inside Server Components.
- You may render a client component from a Server Component, but do not invoke client exports like utility functions/variants directly.
- For server-rendered routes, keep styling either:
  - inline as Tailwind class strings, or
  - in server-safe utility files that do not include `"use client"`.
- Before finishing changes that touch `app/*`, run `npm run lint` and `npm run build` to catch boundary/runtime errors early.

## Agent Guardrails
- Do not edit generated or dependency folders (`node_modules/`, `.next/`, `out/`, `build/`).
- Do not commit secrets or `.env*` files.
- Do not upgrade major dependencies unless explicitly requested.
- Do not replace existing component libraries or architecture unless explicitly requested.

## Change Workflow for Agents
1. Read relevant files before editing to match local conventions.
2. Make the smallest change that satisfies the task.
3. Run `npm run lint` after code changes when feasible.
4. Run `npm run build` for high-impact changes (routing, layout, config, or shared UI).
5. In your final note, list changed files and any verification commands executed.

## High-Signal Opportunities for Future Work
- Replace default app metadata in `app/layout.tsx` with Techzblog-specific title/description.
- Replace starter README content with project-specific documentation.
