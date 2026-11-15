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

## Generated metadata

`packages/meta` contains committed `*.generated.*` files. They are regenerated
by `pnpm --filter meta extract-metadata` (part of `meta`'s `check`), so
`pnpm build` and `pnpm check` may modify them. Do not hand-edit them and do not
blindly revert that churn: regenerate and commit the files together with the
change that caused them.

`theme-styles.generated.ts` embeds CSS from the built themes, so it only changes
when the theme CSS changes. Its Svelte scope hashes are content-based (see
`scripts/css-hash.js`), not path-based, so dependency updates do not churn it.
