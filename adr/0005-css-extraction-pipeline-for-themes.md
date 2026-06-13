# 0005. CSS Extraction Pipeline for Themes

Theme packages that use Tailwind CSS (e.g. `@sjsf/shadcn4-theme`) extract `dist/styles.css` by building an entire SvelteKit app via `vite build`, then scraping `_page*.css` from `.svelte-kit/output/server/_app/immutable/assets/` into `dist/styles.css`.

No other known method can extract styles from Svelte components processed by Tailwind CSS v4, which requires a full scanning pass over resolved imports.

The extracted CSS file is needed for:

- Isolated demos using ShadowDOM, where component-scoped styles don't penetrate the shadow boundary
- Environments that don't support the `@source` rule (StackBlitz and others)
