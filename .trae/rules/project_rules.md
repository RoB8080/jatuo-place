# Project Rules — Concise Guide

## Purpose
- Help ETS2/ATS users build map combos and order mods correctly.

## Core Rules
- Use `pnpm` only for installs and scripts.
- Write code, comments, commits, and UI copy in English; translations in `public/locales`.
- Enforce strict TypeScript and ESLint; ship accessible UI.
- Prefer composition; keep components small and reusable.

## Architecture
- React 19 + Vite + TypeScript.
- TanStack Router (file routes), code splitting via plugin.
- TailwindCSS + shadcn UI primitives.
- React Query for async data.
- i18next with browser detection + HTTP backend.
- SVGR for SVG imports.
- SPA rewrites via `vercel.json`.

### Key Files
- `vite.config.ts`: router plugin, React plugin, Tailwind, SVGR; alias `@` → `src`.
- `src/main.tsx`: bootstrap React, i18n, styles, `routeTree.gen.ts`.
- `src/routes/__root.tsx`: layout with providers, header, toaster.
- `src/libs/i18n.ts`: i18n setup (`en`, `zh`, `ru`; fallback `en`).
- `vercel.json`: `/(.*)` → `/index.html`.

## Project Structure
- `src/components/ui`: low‑level primitives.
- `src/components/common`: reusable composites.
- `src/components/global`: site‑wide components.
- `src/routes`: file‑based pages.
- `src/libs`: utilities (`i18n`, `utils`, domain libs).
- `src/data`: map combo JSONs.
- `public/locales`: translations.
- `assets/svgs`: SVGs.

## Internationalization (i18n)
- Files: `public/locales/<lang>/<ns>.json`; default namespace: `common`.
- Use `useTranslation()` with selector only: `t($ => $.path.to.key)`.
- Keep keys nested/descriptive; avoid bracket access; prefer `$.aB.xY`.
   - dot-separated, camelCase, 2–4 levels; semantic, not positional.
   - Interpolation/plurals: named `{{name}}`; plurals use `count` (`t($ => $.common.items, { count })`).
   - Avoid type-unsafe runtime key concatenation. Some levels being union of string literals is Allowed.
- Wrap all locales in a individual hook as possible as you can therefor i18next-cli can detect them.
  - Good Case:
    ```typescript
    useXXXComponentLocales() {
      const { t } = useTranslation('common');
      // i18next-cli will detect the key in this case
      const someLabel = t($ => $.common.someLabel);
      return { someLabel }
    }
    function XXXComponent () {
      const { someLabel } = useXXXComponentLocales();
      return <div>{someLabel}</div>
    }
    ```
  - Bad Case:
    ```typescript
    function XXXComponent () {
      const { t } = useTranslation('common');
      // i18next-cli may not detect the key in this case
      return <div>{($) => $.common.someLabel}</div>
    }
    ```
- If i18next can't detect the key, add a fallback comment like `// t('external.github', { ns: 'common' })` to ensure extraction.
- CLI:
 - `pnpm i18n:extract` — generate keys once.
  - Run `i18n:dev` during development to catch missing keys.

## Routing
- Create file routes in `src/routes` (`index.tsx`, `map-combo.tsx`, `data-editor.tsx`).
- Use `Link` for internal navigation; avoid raw anchors.
- Keep route modules thin; move shared UI to `components/common` or `components/ui`.
- Type search params via router utilities.

## Styling & UI
- Use TailwindCSS; group classes logically.
- Prefer `components/ui` over raw Radix; compose in `components/common`.
- Use `lucide-react` icons with consistent sizes (`size-4`/`size-5`).
- Use global theme APIs in `components/global/theme`.

## Data & State
- Use React Query for async data; colocate queries near usage.
- Virtualize long lists with `@tanstack/react-virtual`.
- Persist editor state to `localStorage`; for per‑tab isolation, use `sessionStorage` with a tab ID.

## Forms (TanStack Form)
- Build via `createFormHookContexts` + `createFormHook`; use `useAppForm`.
- Render fields with `field.state.value`; prefer `field.handleChange` for standard inputs.
- For components needing an updater, use `field.setValue(updater)` to avoid event unions.
- Use `components/ui/field.tsx` and `components/common/form.tsx` (`SimpleFormField`) for accessible markup and standardized error display.
- Validate with Zod/Standard Schema via `validators`; show `field.state.meta.errors`.
- Arrays: `mode="array"`, manage with `pushValue`/`removeValue`, fields like `people[${i}].name`.
- Submit: prevent default, call `form.handleSubmit()`, control `canSubmit`/`isSubmitting` via `form.Subscribe`.

## TypeScript & Linting
- Strict TypeScript; avoid `any`.
- Path alias `@/*` → `src/*` (`tsconfig.app.json`).
- Fix ESLint warnings; Tailwind and React hooks rules enforced.
- Format via `pnpm format`.

## Commands
- `pnpm tsc -b` — typecheck.
- `pnpm eslint` — lint.
- `pnpm eslint --fix <path>` — auto‑fix.

## Contributing
- Use `pnpm` only; do not use `npm`.
- English for code/comments/commits/UI; translations in `public/locales`.
- Keep components small; prefer composition; extract shared patterns.
- Add translation keys for new UI; run `i18n:dev`.
- Ensure accessibility (labels, focus, keyboard interactions).

## Deployment
- SPA rewrites in `vercel.json`: all routes to `/index.html`.
- If adding server APIs under `/api`, exclude from rewrites and set local proxies.

## AI Coding Tips
- Scaffold pages under `src/routes`; place translations in `public/locales`.
- Use React Query for data; keep query keys stable.
- Build UI from `components/ui`; compose in `components/common`.
- Respect TypeScript/ESLint; avoid suppressions.
- Don’t run `dev` or `preview` script to debug the project. Let user do it.

