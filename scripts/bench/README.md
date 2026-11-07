# Benchmarks

Manual benchmark scripts. They are not part of CI.

## Performance

```sh
pnpm bench:perf
```

Builds `@sjsf/form`, then runs the browser cases in
`packages/basic-theme/tests/benchmarks/perf.bench.ts` in headless Chromium and
prints the median, p95, min, and max of each case.

Options:

```sh
pnpm bench:perf --fields 100,400,1000 --samples 15
pnpm bench:perf --no-build
```

Cases:

- `branch-swap` changes a `dependencies` key so the selected `oneOf` branch
  swaps its object default.
- `dependency-unrelated` updates a field while the schema has a dependency.
- `plain-unrelated` updates a field in a schema without conditionals.
- `dependency-nested` updates a field inside the object whose branch declares
  the default.
- `dependency-create` measures `createForm` plus the initial snapshot.

Each sample is one value command followed by `await tick()`, so it includes the
Svelte flush and any defaults work the command schedules. Compare runs from the
same machine; absolute numbers are not portable.

The browser test posts its samples to a local HTTP sink started by the runner,
because Vitest does not forward browser console output in this setup.

## Bundle size

```sh
pnpm bench:bundle --base v4 --head HEAD
```

Builds both refs in temporary git worktrees, installs dependencies from the pnpm
store (`--offline` first), builds `@sjsf/form` and `@sjsf/basic-theme`, and
reports the minified and gzipped JavaScript size of:

- `form`: `@sjsf/form` with Svelte externalized.
- `app`: a small `@sjsf/basic-theme` app that bundles Svelte and the theme.

Options:

```sh
pnpm bench:bundle --base v4 --head worktree   # include uncommitted changes
pnpm bench:bundle --base v4 --head HEAD --json
pnpm bench:bundle --base v4 --head HEAD --keep
```

`worktree` builds the current checkout instead of a temporary worktree.
`--json` prints machine-readable results. `--keep` keeps the temporary
worktrees for inspection.

The fixture lives in `scripts/bench/bundle-fixture`. The script links the
worktree's `@sjsf/form` and `@sjsf/basic-theme` packages into the fixture's
`node_modules`, so Vite resolves their real `exports` maps. The first run can be
slower if the pnpm store is cold; subsequent runs reuse it.
