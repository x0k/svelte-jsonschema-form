# Agent Instructions

## Docs & skills sync (required)

`skills/` and `apps/docs2` describe the library's public API, so any change
to code users can import, configure, or observe must update the docs
alongside it. Source of truth is `packages/`, `lab/`, and `legacy/` — never
write API usage from memory.

For each such change:

1. Grep `skills/` and `apps/docs2` for references to the changed API.
2. Update every affected snippet and prose section to match the source.
3. Keep the `skills/README.md` catalog in sync if skills are added or renamed.

## Benchmarks

Benchmark tooling is manual and must not run in CI. Compare arbitrary git refs
with `pnpm bench:perf` and `pnpm bench:bundle`; see `scripts/bench/README.md`
and `skills/sjsf-monorepo-dev`.
