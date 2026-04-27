---
"@sjsf/form": patch
---

Fix calculation of the `clearable` condition

Previously: A field is `clearable` if no default value is defined for it
Now: A field is `clearable` if it is not required
