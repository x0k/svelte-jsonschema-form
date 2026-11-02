---
"@sjsf/form": minor
---

Resolve a `$ref` shared by sibling `dependencies`, `allOf` or condition branches instead of treating it as a recursive cycle.

The exported resolution helpers gained optional trailing parameters, and the `stack` passed to `resolveAllReferences()` and `resolveReference()` now tracks only the current resolution path instead of accumulating references resolved by siblings. Callers that reuse one stack across sibling branches will resolve more of those branches than before.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5435>
