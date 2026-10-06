---
"@sjsf/sv": minor
---

Require `sv@^1` and migrate to the published `@sveltejs/sv-utils@^1`, importing
`transforms` from its `browser` entry so codegen stays off the Node-only one.

Generated files are now formatted by the `@sveltejs/sv-utils@1` printer, which
reorders imports, parenthesizes `as const` expressions and rewraps long lines.
