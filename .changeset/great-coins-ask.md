---
"@sjsf-lab/hyperjump-validator": minor
---

[BREAKING] Removed `localization` option — error messages are now localized automatically via `@hyperjump/json-schema-errors`. Use `locale` option instead (e.g., `createFormValidatorFactory({ ast, locale: "en-US" })`).
