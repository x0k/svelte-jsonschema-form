---
"@sjsf/sv": patch
---

List the demo route in the floating `DemoLinks` post-it that `sv` renders from the
root layout, instead of linking it from a `/demo` index page.

Uses `defineDemoPage` from `@sveltejs/sv-utils@^1.0.1`, so both transforms are
idempotent and re-running the add-on no longer duplicates the link. The
`meta/codegen` `addToDemoPage` helper, a copy of the removed `sv` one, is gone.
