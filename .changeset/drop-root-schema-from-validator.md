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

Remove `rootSchema` parameter from `Validator.isValid`, `FormValueValidator.validateFormValue`, and `AsyncFormValueValidator.validateFormValueAsync` methods.

- `isValid(schema, rootSchema, formValue)` → `isValid(schema, formValue)`
- `validateFormValue(rootSchema, formValue)` → `validateFormValue(formValue)`
- `validateFormValueAsync(signal, rootSchema, formValue)` → `validateFormValueAsync(signal, formValue)`

The root schema is now provided at validator creation time instead of per-call. Custom validator implementations must update their signatures accordingly.
