---
"@sjsf/form": patch
---

Read `booleanSelectField` options from `anyOf` before `oneOf`, matching the combination selector, and fall back to the boolean `enum` when the selected list is not constant.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5364>
