# Monorepo Development and Contributing Workflows

## Monorepo Directory Layout

- `packages/`:
  - `form`: Core SJSF engine, basic resolver, translations, modern id-builder, modern merger.
  - `basic-theme`, `shadcn4-theme`, `daisyui5-theme`, `flowbite3-theme`, `skeleton5-theme`: Official theme implementations.
  - `ajv8-validator`, `zod4-validator`, `valibot-validator`, `cfworker-validator`, `schemasafe-validator`, `ata-validator`: Official validator adapters.
  - `sveltekit3`: SvelteKit form actions and progressive enhancement integration.
  - `theme-testing`, `validator-testing`: Reusable test harnesses.
- `lab/`: Experimental packages (`beercss-theme`, `hyperjump-validator`, `shadcn-extras-theme`, `svar-theme`).
- `apps/`:
  - `docs2`: Starlight documentation site.
  - `playground2`: Interactive schema and theme tester.
  - `builder`: Form builder app.
- `examples/`: Starter templates for each theme and validator combination.

---

## Detailed Commands

### 1. Build

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @sjsf/form build
```

### 2. Run Tests

SJSF uses Vitest with `@vitest/browser` and Playwright for real browser-based component testing:

```bash
# Run all tests
pnpm test

# Run tests in a specific package
pnpm --filter @sjsf/form test

# Run tests with UI
pnpm --filter @sjsf/shadcn4-theme test --ui
```

### 3. Linting and Formatting

```bash
# Fast formatting with oxfmt
pnpm format
pnpm format:check

# ESLint check
pnpm lint
pnpm lint:fix
```

### 4. Type Checking

```bash
pnpm check
# Or via svelte-check directly in a package
pnpm --filter @sjsf/form run check
```

---

## Adding a New Theme or Validator

1. Copy boilerplate from an existing package in `packages/` or `lab/`.
2. Add dependency on `@sjsf/theme-testing` or `@sjsf/validator-testing`.
3. Re-export the standard test suites to verify that all foundational fields and widgets satisfy the contract.
4. Add an example starter in `examples/`.
5. Run `pnpm changeset` to record the new package or feature.
