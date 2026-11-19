---
"@sjsf/sv": patch
---

The generated `defaults` resolver now handles recursive `$ref` cycles and
selects `anyOf` before `oneOf`, matching `@sjsf/form/resolvers/basic`.
