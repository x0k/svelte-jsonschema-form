---
"@sjsf/form": patch
---

Read `booleanSelectField` options from `anyOf` before `oneOf`, matching the combination selector. Only constant object options are used; otherwise fall back to the boolean `enum` (or the default `Yes`/`No` options). A constant option declared with a single-value `enum` is now labelled by its value.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5364>
