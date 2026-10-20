---
"@sjsf/form": patch
---

Resolve a `$ref` shared by sibling `dependencies`, `allOf` or condition branches instead of treating it as a recursive cycle.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5435>
