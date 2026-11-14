# Monorepo Development and Contributing Workflows

## Monorepo Directory Layout

- `packages/`:
  - `form`: Core SJSF engine, basic resolver, translations, modern id-builder, modern merger.
  - `basic-theme`, `shadcn4-theme`, `daisyui5-theme`, `flowbite3-theme`, `skeleton5-theme`: Official theme implementations.
  - `ajv8-validator`, `zod4-validator`, `valibot-validator`, `cfworker-validator`, `schemasafe-validator`, `ata-validator`, `hyperjump-validator`: Official validator adapters.
  - `sveltekit3`: SvelteKit form actions and progressive enhancement integration.
  - `sv`: Svelte CLI add-on; bundles `meta` to generate project files.
  - `theme-testing`, `validator-testing`: Reusable test harnesses.
- `lab/`: Experimental packages (`beercss-theme`, `shadcn-extras-theme`, `svar-theme`).
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

### 5. Benchmarks

Two manual tools compare arbitrary git refs. They are intentionally **not**
wired into CI.

Both scripts build each ref in an isolated git worktree; `worktree` (or `.`)
uses the current checkout. Fetch the refs you want to compare first; the
scripts do not fetch automatically. Defaults are `origin/main` (base) and
`HEAD` (head). Both print the resolved SHAs. The scripts are TypeScript and run
directly through Node's built-in type stripping.

In this repository, `mk bp` and `mk bb` run the same commands with the same
defaults.

#### Performance

```bash
pnpm bench:perf --base origin/main --head HEAD
```

- Copies `packages/basic-theme/tests/benchmarks` from the current checkout
  into each ref's worktree, so both refs run identical cases.
- Runs headless Chromium and reports median/p95/min/max per ref plus a
  base-to-head comparison.
- Cases: `create`, `edit`, `edit-conditional`, `edit-nested`, `branch-swap`.
- Updates are dispatched as DOM events, so the suite works across refs with
  different form value APIs.
- Options: `--fields 100,400,1000`, `--samples 15`, `--json`, `--keep`,
  `--no-build`.

#### Bundle size

```bash
pnpm bench:bundle --base origin/main --head HEAD
```

- Compares minified and gzipped JS for the `form` entry (`@sjsf/form` with
  Svelte externalized) and the `app` entry (a small `@sjsf/basic-theme` app
  that bundles Svelte and the theme).
- Options: `--json`, `--keep`.

Absolute timings and sizes are machine-specific; compare runs from the same
machine. See `scripts/bench/README.md` for the implementation and fixture
layout.

---

## Adding a New Theme, Icon Set, or Validator

1. Copy boilerplate from an existing package in `packages/` (stable) or `lab/`
   (experimental): a theme, an icon set, or a validator.
2. Themes and validators: add a dependency on `@sjsf/theme-testing` or
   `@sjsf/validator-testing` and re-export the standard test suites so all
   foundational fields and widgets satisfy the contract. Icon sets follow the
   existing icon package structure.
3. Register the package in `meta`: add it to `packages/meta/package.json` and
   add its `package.json` import and entries to the relevant lists and package
   maps in `packages/meta/src/themes.ts`, `icons.ts`, or `validators.ts`.
4. Add an example starter in `examples/`.
5. If the package is stable, add it to the `fixed` group in
   `.changeset/config.json`. Its changeset then joins the next group release,
   which rebuilds `@sjsf/sv` with the new `meta` data.
6. Run `pnpm changeset` to record the new package or feature. For `lab/` or
   `legacy/` packages, also add an `@sjsf/sv` changeset: `meta` is only a
   devDependency of `sv`, so changesets does not bump the add-on by itself.
7. Run `pnpm --filter @sjsf/sv --filter meta run test -u` if generated
   snapshots change.
8. New npm package names must be bootstrapped before merging; see
   [Publishing a New Package to npm](#publishing-a-new-package-to-npm). The
   first trusted publish also requires `repository.url` in `package.json` to
   exactly match the GitHub repository.

---

## Publishing a New Package to npm

The release workflow uses npm trusted publishing (OIDC), which can only publish
versions of packages that already exist on npm. A package that is added to this
workspace therefore needs a one-time bootstrap before its first release.

1. Check the registry state:

   ```bash
   pnpm release:check
   pnpm release:check @sjsf/new-validator
   ```

   CI runs the check on pull requests, and the release workflow runs it before
   the changesets action, so a missing package blocks both the release PR and
   the publish run. If you merge an un-bootstrapped package, the workflow fails
   on `main` and no release PR is created; bootstrap the reported names and
   re-run the workflow.

2. Bootstrap the missing package from an authenticated npm session:

   ```bash
   pnpm release:bootstrap @sjsf/new-validator
   ```

   This requires npm 11.15+ (`npm stage` / `npm trust`). It stages a throwaway
   `0.0.0-bootstrap` version (creating the package name and the public
   `0.0.0-stage` placeholder) and configures `version-and-publish.yaml` as a
   trusted publisher. The `npm trust github` step prompts for 2FA and cannot
   run in CI.

   > A new trusted publisher expires two days after creation unless it
   > completes its first publish. Bootstrap shortly before the first release
   > and land the release within that window; otherwise delete the expired
   > configuration and re-run the bootstrap.

   Use `--dry-run` to inspect the commands or `--no-trust` to only stage the
   package. `--trust` also configures publishing for packages that already
   exist. See `scripts/release/README.md` for details.

3. Merge the package and its changeset, then let the normal **Version and
   Publish** workflow publish it. Make sure `repository.url` in the package's
   `package.json` matches the GitHub repository, or the OIDC publish fails.

4. After the real version is live, remove the bootstrap stage:

   ```bash
   pnpm release:cleanup @sjsf/new-validator
   ```

   Cleanup rejects the staged bootstrap entry, removes the `0.0.0-stage`
   placeholder if it remains, and removes a mistakenly approved
   `0.0.0-bootstrap` version. It refuses to run before a real version exists,
   because unpublishing the only published version would remove the package
   and its trusted publisher configuration.

The preflight cannot verify trusted publisher configuration: npm requires an
authenticated 2FA request to list it. It verifies package existence only.
