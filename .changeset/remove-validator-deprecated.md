---
"@sjsf/ajv8-validator": major
"@sjsf/schemasafe-validator": major
"@sjsf/ata-validator": major
"@sjsf/zod4-validator": major
"@sjsf/valibot-validator": major
"@hyperjump/json-schema-validator": major
---

Removed deprecated APIs:

- `LegacyValidatorOptions` with `validateFunctions`/`augmentSuffix`/`ast` — use `validatorRetriever` instead (ajv8, schemasafe, ata, hyperjump).
- `setupFormValidator` — use `adapt` instead (zod4, valibot).
- `setupAsyncFormValidator` — use `adaptAsync` instead (zod4, valibot).
