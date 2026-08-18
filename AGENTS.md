# AGENTS.md

## Project Overview

This is a **Next.js + TypeScript + Tailwind CSS** application using the **App Router**.

Follow the conventions and rules in this file for all development work.

## Package Manager

- Use **npm** for package management.
- Use `npm install` to install dependencies.
- Use `npm run <script>` to run project scripts.
- Do not introduce `yarn`, `pnpm`, or `bun` unless explicitly requested.
- Keep `package-lock.json` committed and up to date.

## Project Structure

All application source code must live inside `src/`.

```text
.
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── ...
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── .gitignore
├── .prettierrc.json
├── README.md
└── AGENTS.md
```

### Rules

- `src/app/` contains routes, layouts, loading states, error states, and route-specific files.
- `src/components/` contains reusable React components.
- `src/lib/` contains external integrations, API clients, configuration helpers, and shared business logic.
- `src/hooks/` contains reusable React hooks.
- `src/types/` contains shared TypeScript types.
- `src/utils/` contains generic utility functions.
- `public/` must remain **outside `src/`**.
- Do not create application source files outside `src/`.
- Avoid deeply nested directories unless there is a clear reason.

## Components

Every reusable React component belongs in:

```text
src/components/
```

Organize components by feature when appropriate:

```text
src/components/
├── Button/
│   └── Button.tsx
├── Header/
│   └── Header.tsx
└── ProductCard/
    └── ProductCard.tsx
```

For small projects, flat files are also acceptable:

```text
src/components/Button.tsx
src/components/Header.tsx
```

### Component Rules

- Use functional components.
- Use TypeScript for all components.
- Always use default exports for components.
- Keep components focused on one responsibility.
- Extract reusable UI instead of duplicating markup.
- Avoid unnecessarily large components.
- Prefer composition over complex conditional components.
- Do not put API calls directly inside presentational components.
- Keep business logic and data manipulation out of reusable UI components when possible.
- Helper, formatting, and badge-styling functions belong in `src/utils/`, not inline inside components.

## Next.js App Router

Use the **App Router** exclusively.

- Routes belong under `src/app/`.
- `src/app/**/page.tsx` files should only handle data preparation / fetching and delegate all UI rendering to dedicated feature components under `src/components/[feature]/`.
- Use Server Components by default.
- Add `"use client"` only when client-side functionality is required.
- Prefer Server Components for data fetching.
- Use Client Components for:

  - State
  - Event handlers
  - Browser APIs
  - Effects
  - Interactive UI

- Do not add `"use client"` unnecessarily.
- Use `loading.tsx` for loading states when appropriate.
- Use `error.tsx` for route-level error handling when appropriate.
- Use `not-found.tsx` for 404 states when appropriate.
- Use layouts for shared route structure.

## TypeScript

TypeScript should be strict and type-safe.

- Avoid `any`.
- Prefer explicit types for public function parameters and return values.
- Use `type` for object and union types unless an `interface` provides a clear benefit.
- Do not use type assertions to silence TypeScript errors without understanding the underlying issue.
- Prefer narrowing and proper type guards.
- Keep shared types in `src/types/`.
- Avoid duplicating the same type in multiple files.

Example:

```ts
type Product = {
  id: string;
  name: string;
  price: number;
};
```

## Tailwind CSS

Use **Tailwind CSS v4** with clean, minimalist admin dashboard aesthetics.

- Prefer utility classes over custom CSS.
- Adhere to the configured `@theme` design tokens in `src/styles/globals.css`:
  - `bg-primary` / `text-primary` (`#6F42C1`)
  - `bg-secondary` / `text-secondary` (`#007BFF`)
  - `bg-accent-1`, `bg-accent-2`, `bg-accent-3` (`#00CCCC`, `#0DCAF0`, `#17A2B8`)
  - `text-dark` (`#0F172A` - primary text)
  - `text-light` (`#64748B` - secondary text)
  - `border-border` (`#E2E8F0` - crisp borders)
  - `bg-surface` (`#FFFFFF` - flat card backgrounds)
  - `bg-app-bg` (`#F8FAFC` - neutral page background)
- Prioritize high utility, clear typography, and crisp solid borders over heavy gradients, neon glows, or deep drop shadows.
- Avoid adding custom CSS for something Tailwind can handle.
- Keep class names readable.
- Use responsive utilities instead of JavaScript-based viewport detection.
- Reuse common styles through components rather than duplicating large class strings.

## Data Fetching

- Prefer server-side data fetching in Server Components.
- Keep API clients and external integrations in `src/lib/`.
- Do not duplicate API request logic across components.
- Handle loading, empty, and error states.
- Validate external data before relying on it.
- Do not expose secrets or server-only environment variables to the client.

## Error Handling

- Handle expected errors explicitly.
- Do not silently swallow errors.
- Use meaningful error messages.
- Use route-level `error.tsx` where appropriate.
- Use `try/catch` around operations where recovery or custom error handling is required.
- Do not wrap every function in unnecessary `try/catch` blocks.

## Environment Variables

- Secrets must never be committed.
- Use `.env.local` for local secrets.
- Only variables prefixed with `NEXT_PUBLIC_` should be exposed to the browser.
- Never expose API keys, tokens, database credentials, or private configuration through client-side code.
- Keep environment variable access centralized when practical.

## Imports

Prefer the configured TypeScript path alias:

```tsx
import { Button } from '@/components/Button';
```

instead of long relative imports:

```tsx
import { Button } from '../../../components/Button';
```

Keep imports organized and remove unused imports.

## Naming Conventions

- Components: `PascalCase`
- Hooks: `camelCase` beginning with `use`
- Functions: `camelCase`
- Variables: `camelCase`
- Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants
- Route folders: lowercase / URL-friendly names
- Files should generally match the primary component or module they contain.

Examples:

```text
ProductCard.tsx
useProducts.ts
product-api.ts
formatCurrency.ts
```

## Prettier

All code must be formatted with Prettier.

Use these formatting preferences:

- Single quotes
- Use semicolons
- Trailing commas where supported
- 2-space indentation
- Print width: 80
- LF line endings
- One blank line between logical sections
- Files must end with exactly one newline

Recommended configuration:

```js
/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: 'lf',
};

export default config;
```

Do not manually format code differently from the project's Prettier configuration.

## ESLint

- Keep ESLint enabled.
- Fix lint errors instead of disabling rules.
- Do not use `eslint-disable` unless there is a legitimate reason.
- If a rule must be disabled, keep the scope as small as possible and explain why.

## Accessibility

All UI should be accessible by default.

- Use semantic HTML.
- Buttons should use `<button>`.
- Links should use `<a>` or Next.js `<Link>`.
- Images must have meaningful `alt` text when appropriate.
- Interactive elements must be keyboard accessible.
- Do not rely solely on color to communicate information.
- Form controls should have associated labels.
- Preserve visible focus states.

## Performance

- Prefer Server Components.
- Avoid unnecessary client-side JavaScript.
- Avoid unnecessary `useEffect`.
- Avoid unnecessary `useMemo` and `useCallback`; use them only when they provide a real benefit.
- Optimize images with Next.js `<Image>` when appropriate.
- Avoid fetching the same data multiple times.
- Keep bundles small and avoid unnecessary dependencies.

## Dependencies

Before adding a dependency:

1. Check whether the functionality can reasonably be implemented with existing dependencies.
2. Prefer well-maintained packages.
3. Avoid adding a dependency for trivial functionality.
4. Install dependencies with npm.
5. Keep `package-lock.json` synchronized.

Example:

```bash
npm install package-name
```

## Git

- Make focused changes.
- Do not modify unrelated files.
- Do not commit secrets or `.env` files.
- Do not rewrite Git history unless explicitly requested.
- Use clear commit messages.
- Review the diff before considering work complete.

## Before Finishing a Task

Run the project's available checks, preferably:

```bash
npm run lint
npm run build
```

If formatting is configured:

```bash
npm run prettier
```

Verify:

- TypeScript has no errors.
- ESLint has no errors.
- Prettier formatting is correct.
- The application builds successfully.
- No unnecessary files or dependencies were added.
- No secrets were exposed.
- The implementation follows the existing project architecture.

## General Development Principles

- Prefer simple solutions over clever solutions.
- Reuse existing components and utilities before creating new ones.
- Follow existing patterns in the codebase.
- Do not introduce architectural changes without a clear reason.
- Keep changes minimal and focused on the requested task.
- Do not change behavior unrelated to the task.
- Ask for clarification when requirements are genuinely ambiguous.
- When fixing a bug, identify and fix the underlying cause rather than masking the symptom.
- Leave the codebase cleaner than you found it.
