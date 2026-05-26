# AGENTS.md

## Monorepo Structure

pnpm + Turborepo monorepo. **pnpm is required** (enforced by `preinstall`).

```
packages/     # Core published packages (@sjsf/*, fixed versioning via changesets)
  form/           # Main library: @sjsf/form — Svelte 5 runes-mode form engine
  basic-theme/    # @sjsf/basic-theme
  shadcn4-theme/  # @sjsf/shadcn4-theme
  daisyui5-theme/ # @sjsf/daisyui5-theme
  skeleton4-theme/# @sjsf/skeleton4-theme
  flowbite3-theme/# @sjsf/flowbite3-theme
  flowbite-icons/ # @sjsf/flowbite-icons
  lucide-icons/   # @sjsf/lucide-icons
  moving-icons/   # @sjsf/moving-icons
  radix-icons/    # @sjsf/radix-icons
  ajv8-validator/ # @sjsf/ajv8-validator
  zod4-validator/ # @sjsf/zod4-validator
  valibot-validator/ # @sjsf/valibot-validator
  cfworker-validator/# @sjsf/cfworker-validator
  schemasafe-validator/ # @sjsf/schemasafe-validator
  sveltekit/      # @sjsf/sveltekit (SvelteKit integrations)
  sv/             # @sjsf/sv (Svelte CLI add-on)
  meta/           # Private — generates field/widget metadata
  theme-testing/  # Private — shared theme test utilities
  validator-testing/ # Private — shared validator test utilities
legacy/       # Older theme versions (daisyui, shadcn, skeleton3, flowbite)
lab/          # Experimental packages (@sjsf-lab/*): beercss, svar, shadcn-extras themes; ata, hyperjump validators
apps/         # docs2 (Astro), builder, playground2
examples/     # Starter templates per theme/validator combo
```

## Commands

```bash
pnpm install                  # Install all workspace dependencies
pnpm run build                # Build all packages (turbo, concurrency 12)
pnpm run check                # Type-check all packages
pnpm run test                 # Run all tests
pnpm run dev                  # Start dev servers (persistent)

# Filtered builds (common patterns)
pnpm run build --filter="@sjsf/*" --filter="@sjsf-lab/*"
pnpm run build --filter="./apps/*"

# Single package
pnpm run test --filter @sjsf/form
pnpm run check --filter @sjsf/basic-theme
```

There is also an `mkfile` with shorthand targets: `mk f/b` (build form), `mk shad/c` (check shadcn4), `mk sjsf/t` (test all @sjsf/\*), etc.

## Testing

- **Unit tests**: Vitest (browser mode with `@vitest/browser`).
- Run a single package's tests: `pnpm run test --filter @sjsf/form`
- **E2E tests**: Playwright (some theme/sveltekit packages). Requires `PLAYWRIGHT_BROWSERS_PATH` env var in CI.
- **Snapshot updates**: `pnpm run test -- <filter> -- -u`

## Key Gotchas

- **Svelte 5 runes mode**: `svelte.config.js` has `compilerOptions: { runes: true }`. All reactive state uses `$state`, `$derived`, `$effect` — no `$:` reactive declarations.
- **CSS extraction for themes** is a multi-step pipeline (build SvelteKit app → find generated CSS → move to `dist/styles.css`). If a theme build fails, check that step.
- **Meta package codegen**: `packages/meta` must run `extract-metadata` before type-checking; the check script handles this, but editing meta package directly requires running the scripts manually.
- **Docs precompilation**: `apps/docs2` must precompile validators before check/build. The `check` script handles this via `precompile-validators`.
- **Catalog protocol**: Third-party dep versions are centralized in `pnpm-workspace.yaml` via `catalog:` and `catalogs:legacy`. Use `catalog:` references, not hardcoded versions.
- **Workspace protocol**: Internal dependencies use `workspace:*` in devDependencies.
- **Changesets**: All published `@sjsf/*` packages are on a fixed versioning schedule (single version bump for all). Base branch is `main`. Use `pnpm changeset` to create changesets.

## Lint & Format

```bash
# Per-package (where eslint config exists)
pnpm run lint --filter @sjsf/form     # prettier --check . && eslint .
pnpm run format --filter @sjsf/form   # prettier --write .
```
