# Benchmarks

Manual benchmark tools. They are not part of CI.

Both scripts compare arbitrary git refs. Each ref is built in an isolated
worktree; `worktree` (or `.`) uses the current checkout. Fetch the refs you want
to compare first; the scripts do not fetch automatically. The default base is
`origin/main` and the default head is `HEAD`.

## Performance

```sh
pnpm bench:perf --base origin/main --head HEAD
```

Builds each ref, copies the benchmark suite from the current checkout into the
ref's worktree, runs the cases in headless Chromium, and prints per-ref
summaries plus a comparison table.

Options:

```sh
pnpm bench:perf --base origin/main --head worktree
pnpm bench:perf --base HEAD~1 --head HEAD --fields 100,400,1000 --samples 15
pnpm bench:perf --base origin/main --head HEAD --json
pnpm bench:perf --base origin/main --head HEAD --keep
pnpm bench:perf --base origin/main --head HEAD --no-build
```

Cases:

- `create`: create a form with N fields and take the initial snapshot.
- `edit`: update a top-level field in a plain schema.
- `edit-conditional`: update an unrelated field in a schema with a conditional
  dependency.
- `edit-nested`: update a nested field in the selected conditional branch.
- `branch-swap`: toggle the discriminator so the selected branch changes.

Each sample is one DOM update (or form creation) plus `await tick()`, so it
includes the Svelte flush and any work scheduled by the update. The suite lives
in `packages/basic-theme/tests/benchmarks/perf.bench.ts`; add cases there.

The browser test posts samples to a local HTTP sink started by the runner,
because Vitest does not forward browser console output in this setup.

## Bundle size

```sh
pnpm bench:bundle --base origin/main --head HEAD
```

Builds both refs in temporary git worktrees, installs dependencies from the pnpm
store (`--offline` first), builds `@sjsf/form` and `@sjsf/basic-theme`, and
reports the minified and gzipped JavaScript size of:

- `form`: `@sjsf/form` with Svelte externalized.
- `app`: a small `@sjsf/basic-theme` app that bundles Svelte and the theme.

Options:

```sh
pnpm bench:bundle --base origin/main --head worktree   # include uncommitted changes
pnpm bench:bundle --base HEAD~1 --head HEAD --json
pnpm bench:bundle --base origin/main --head HEAD --keep
```

`worktree` builds the current checkout instead of a temporary worktree.
`--json` prints machine-readable results. `--keep` keeps the temporary
worktrees for inspection.

The fixture lives in `scripts/bench/bundle-fixture`. The script links the
worktree's `@sjsf/form` and `@sjsf/basic-theme` packages into the fixture's
`node_modules`, so Vite resolves their real `exports` maps. The first run can be
slower if the pnpm store is cold; subsequent runs reuse it.

## Notes

- Both scripts export `main()` and only run it under `import.meta.main`, so they
  can be imported without executing.
- Absolute timings and sizes are machine- and commit-specific.
- Compare runs from the same machine.
- Both refs must expose the public API used by the suite and fixture.
