---
"@sjsf/form": major
"@sjsf/ajv8-validator": major
"@sjsf/ata-validator": major
"@sjsf/cfworker-validator": major
"@sjsf/schemasafe-validator": major
"@sjsf/valibot-validator": major
"@sjsf/zod4-validator": major
"@sjsf/sveltekit": major
"@sjsf-lab/hyperjump-validator": major
---

Remove `rootSchema` parameter from `Validator.isValid` method. The `isValid` method now takes `(schema, formValue)` instead of `(schema, rootSchema, formValue)`. Custom validator implementations must update their `isValid` signature accordingly.
