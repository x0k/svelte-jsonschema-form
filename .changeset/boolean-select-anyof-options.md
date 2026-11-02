---
"@sjsf/form": patch
---

Read `booleanSelectField` options from `anyOf` before `oneOf`, falling back to the boolean `enum` unless every option is a constant or a boolean schema. Single-value `enum` constants now use their value as the label.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5364>
