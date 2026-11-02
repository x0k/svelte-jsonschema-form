---
"@sjsf/form": major
---

`booleanSelectField` no longer reads options from `oneOf`, including boolean subschemas such as `oneOf: [true, false]`; it only uses the boolean `enum` or the default Yes/No options. If you relied on alternative titles or ordering, declare an `enum` or provide a custom field accepting `SchemaValue`.
