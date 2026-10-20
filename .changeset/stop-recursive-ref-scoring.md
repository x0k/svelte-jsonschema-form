---
"@sjsf/form": patch
---

Stop scoring a recursive `$ref` once the form data has no value left for it, which could previously overflow the stack.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5353>
