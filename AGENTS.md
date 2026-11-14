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

## Architecture decision records (required)

Record non-obvious architectural decisions in `adr/` as numbered Markdown
files. Use the next zero-padded number and a short kebab-case title
(`0009-short-title.md`) and follow the existing format: a `# NNNN. Title`
heading, then the decision, why it was made, and which alternatives were
rejected.

Add an ADR in the same change when it introduces or overturns a decision about
package boundaries, public API shape, type-system design, build or release
infrastructure, or anything else a future maintainer would otherwise need to
re-litigate. Routine fixes, dependency bumps, and docs edits do not need one.

Keep each ADR to a single decision and a few paragraphs; link to the relevant
PR or issue. Do not silently contradict an existing ADR: if a decision is
replaced, add a new numbered ADR that links to the one it supersedes.

## Benchmarks

Benchmark tooling is manual and must not run in CI. Compare arbitrary git refs
with `pnpm bench:perf` and `pnpm bench:bundle`; see `scripts/bench/README.md`
and `skills/sjsf-monorepo-dev`.
