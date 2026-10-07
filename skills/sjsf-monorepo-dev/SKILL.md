---
name: sjsf-monorepo-dev
description: Development and contribution workflows for the svelte-jsonschema-form monorepo. Use when building packages, running vitest browser tests with playwright, adding new themes or validator packages, checking types with turbo/svelte-check, or creating changesets.
---

# SJSF Monorepo Development & Contributing

This skill guides development, testing, and contribution inside the `svelte-jsonschema-form` repository.

## Step 1: Package Manager & Environment Setup

This repository enforces **`pnpm`** strictly via `only-allow`:

```bash
# Verify pnpm version
pnpm --version

# Install all workspace dependencies
pnpm install
```

Do not run `npm install` or `yarn install`.

---

## Step 2: Build and Type Check

Builds are orchestrated by Turbo:

```bash
# Build all packages across the workspace
pnpm build

# Typecheck all packages
pnpm check

# Start development watchers
pnpm dev
```

---

## Step 3: Run Automated Tests

SJSF utilizes **Vitest in browser mode** using Playwright to test components inside a real headless browser environment:

```bash
# Run all workspace test suites
pnpm test

# Test a single package
pnpm --filter @sjsf/form test
pnpm --filter @sjsf/shadcn4-theme test
pnpm --filter @sjsf/ajv8-validator test
```

See [Contributing Workflows](references/contributing-workflows.md) for package layouts and testing harnesses (`theme-testing`, `validator-testing`).

---

## Step 4: Formatting and Linting

The repo uses `oxfmt` for ultra-fast formatting and ESLint for code quality:

```bash
# Check formatting
pnpm format:check

# Format code
pnpm format

# Run ESLint
pnpm lint
pnpm lint:fix
```

---

## Step 5: Recording Changesets

Every PR introducing a bugfix, new feature, or breaking change must include a changeset:

```bash
# Generate a changeset
pnpm changeset
```

Follow the interactive prompts:
1. Select packages that changed.
2. Select semver bump type (`patch`, `minor`, `major`).
3. Enter a clear summary of changes.

---

## Gotchas & Rules

1. **Browser Testing Requirement**: Unit tests test real DOM rendering via `@vitest/browser` and Playwright. Ensure local browser dependencies are present if running full suites locally.
2. **Catalog Dependencies**: Shared dependencies (Svelte, Vite, TypeScript) are declared in `pnpm-workspace.yaml` catalog. Reference them in individual `package.json` files using `"catalog:"`.
3. **No Unmatched Formatting Pattern**: Lint-staged runs `oxfmt --no-error-on-unmatched-pattern`. Always format before committing.
