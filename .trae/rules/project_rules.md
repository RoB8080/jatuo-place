# Project Rules & Architecture

This project serves an ETS2/ATS community. Its primary functionality is to help users build map combos and order their mod list correctly to avoid crashes.

## Features
- Prebuilt map combos that users can adopt quickly.
- Users select a combo version and choose desired mods; the app guides ordering.
- WIP: "Download List" compares expected vs. local mod folder to highlight missing assets.
- "Mod Order" provides an ordered list mirroring the in‑game list for easier setup.

## Architecture Overview
- Frontend: React 19, Vite, TypeScript.
- Routing: TanStack Router with file‑based routes (`src/routes/*`) and code splitting via the plugin.
- Styling: TailwindCSS with a small design system based on shadcn UI.
- Data & State: React Query for async data caching; component‑local state otherwise.
- Internationalization: i18next with browser language detection and HTTP backend.
- Build tooling: ESLint (strict TypeScript), Prettier rules via eslint‑plugin‑prettier.
- Assets: `vite-plugin-svgr` allows importing SVGs as React components.
- SPA serving: `vercel.json` rewrites all paths to `index.html` for client‑side routing.

### Key Files
- `vite.config.ts`:
  - Plugins: `@tanstack/router-plugin/vite` (file routes + auto code splitting), `@vitejs/plugin-react`, Tailwind, SVGR.
  - Alias: `@` → `src` for clean imports.
- `src/main.tsx`:
  - Bootstraps React 19, loads i18n, styles, and the generated route tree (`routeTree.gen.ts`).
- `src/routes/__root.tsx`:
  - App root layout with `QueryClientProvider`, global header, toaster, and outlet.
- `src/libs/i18n.ts`:
  - i18next setup (supported languages: `en`, `zh`, `ru`; fallback: `en`).
- `vercel.json`:
  - SPA rewrite: `/(.*)` → `/index.html`.

## Internationalization (i18n)
- Files live in `public/locales/<language>/<namespace>.json`.
- Default namespace: `common`.
- Use `useTranslation()` and the selector form only: `t($ => $.path.to.key)`.
- i18n CLI:
  - `pnpm i18n:extract` — extract translation keys once.
- Keep keys nested and descriptive; avoid free‑form string calls.
 - Prefer wrapping `useTranslation()` + `t` calls into a dedicated hook at outer scope so the extractor can recognize them; if not possible, add a fallback comment like `// t('external.github', { ns: 'common' })` to help the extractor detect the key.
 - Use clear, direct key paths (avoid bracket access). Prefer `$.aB.xY` over `$['a-b']['x-y']` style access.

## Project Structure
- `src/components` — UI building blocks and composites:
  - `ui/` — low‑level primitives (mostly derived from shadcn, customized as needed).
  - `common/` — reusable composites built on `ui` for page assembly.
  - `global/` — site‑wide components (Header, ThemeProvider, Language Select, etc.).
  - Route‑specific component folders sit under their route modules when practical.
- `src/routes` — TanStack file routes. Add pages here; the route tree is generated.
- `src/libs` — utilities and module‑specific helpers (`i18n`, `utils`, domain libs).
- `src/data` — core map combo JSON, one file per version.
- `public/locales` — translation resources.
- `assets/svgs` — SVGs importable via SVGR.

## Routing Guidelines
- Use file‑based routes under `src/routes/` (e.g., `index.tsx`, `map-combo.tsx`, `data-editor.tsx`).
- Import `Link` from TanStack Router for navigation; never hardcode anchors for internal links.
- Keep route components thin; push reusable UI into `components/common` or `components/ui`.
- If adding search params, prefer typed access via router utilities.

## Styling & UI Guidelines
- TailwindCSS is the primary styling system; keep classes readable and grouped logically.
- Favor components in `components/ui` over raw Radix primitives; extend via `components/common`.
- Use `lucide-react` for icons; keep sizes consistent (`size-4/size-5`).
- Theme handling lives under `components/global/theme`; prefer those APIs for dark/light.

## Data & State Guidelines
- Use React Query for async data fetching/caching; colocate queries near usage.
- For large lists, prefer virtualization (`@tanstack/react-virtual`).
- Persist editor working data using localStorage by default. If per‑tab isolation is needed, key by a session/tab identifier (e.g., `WORKING_DATA_KEY:<tabId>` stored in `sessionStorage`).

## Forms (TanStack Form)
- Compose forms via a custom hook using `createFormHookContexts` and `createFormHook` to pre-bind field/form components; prefer `form.AppField` for context-provided fields. Guide: https://tanstack.com/form/latest/docs/framework/react/guides/form-composition
- Render controlled inputs with `field.state.value`, `field.handleChange`, and `field.handleBlur`; keep types explicit and leverage TanStack Form's type inference.
- Integrate with shadcn/ui using components from `src/components/ui/field.tsx` (Field, FieldLabel, FieldDescription, FieldError, etc.) for accessible markup; additionally, use our project wrapper in `src/components/common/form.tsx` — `SimpleFormField` for UI-only wrapping and `useAppForm` built via `createFormHookContexts`/`createFormHook` to pre-bind field/form components and standardize error display. Guide: https://ui.shadcn.com/docs/forms/tanstack-form
- Validation via Zod or Standard Schema using `validators` (`onSubmit`, `onChange`, `onBlur`); display errors from `field.state.meta.errors`.
- Arrays: declare array fields with `mode="array"`, manage items via `field.pushValue`/`removeValue`, and create subfields with names like `people[${i}].name`. Guide: https://tanstack.com/form/latest/docs/framework/react/guides/arrays
- Submission: prevent default submit, call `form.handleSubmit()`, and use `form.Subscribe` to control `canSubmit`/`isSubmitting`.
- Organization: extract reusable field/form components to `components/common` and register them in the custom hook's `fieldComponents`/`formComponents` to reduce verbosity.

## TypeScript & Linting
- TypeScript is strict. Keep types explicit; avoid `any`.
- Path alias: `@/*` → `src/*` (see `tsconfig.app.json`).
- ESLint config enforces React hooks and Tailwind usage; fix warnings before merging.
- Prettier is applied via eslint plugin; run `pnpm format` to auto‑fix.

## Commands
- `pnpm tsc -b` — typecheck.
- `pnpm eslint` — lint check.
- `pnpm eslint --fix <scope>` — auto‑fix lint issues; limit scope to avoid large changes.

## Contributing Rules
- Use `pnpm` exclusively; do not use `npm` (install dependencies, run scripts, and manage the lockfile with `pnpm` only).
- Write everything in English (code, comments, commit messages, and UI copy); translations live in `public/locales`.
- Keep components small and focused; avoid monolithic pages.
- Prefer composition over inheritance; extract common patterns to `components/common`.
- Always add translation keys for new UI, and run `i18n:dev` while developing.
- Write accessible components (labels, focus states, keyboard interactions) consistent with our UI primitives.

## Deployment Notes
- This app is a SPA; `vercel.json` rewrites all routes to `/index.html`.
- If server APIs are introduced later (e.g., Vercel Functions under `api/`), update rewrites to exclude `/api` and configure local proxies accordingly.

## AI Coding Tips
- When adding a page, scaffold a file route under `src/routes/` and keep translations in `public/locales`.
- When introducing data fetching, use React Query and keep query keys stable.
- For new UI elements, start from `components/ui` and compose in `components/common`.
- For i18n, only use the selector function form with `t($ => ...)`.
- Respect strict TypeScript and ESLint rules; avoid suppressions unless justified.
- Do not self-run `pnpm dev` or `pnpm preview` to verify results; leave verification to the user.

