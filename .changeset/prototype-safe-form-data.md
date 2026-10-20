---
"@sjsf/form": patch
---

Preserve form-data and schema keys named `__proto__`, and stop inherited members such as `toString` from being read as form data or schema properties. Merging, default generation, sanitizing, extra-data omission and value reconciliation now write those keys as own properties.

Ports https://github.com/rjsf-team/react-jsonschema-form/pull/5515.
