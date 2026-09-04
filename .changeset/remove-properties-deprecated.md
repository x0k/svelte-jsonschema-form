---
"@sjsf/form": major
---

Removed deprecated APIs:

- `removeVirtualAdditionalProperties()` from `@sjsf/form/validators/properties`.
- `createVirtualAdditionalPropertiesRemover()` from `@sjsf/form/validators/properties`.

Other breaking changes:

- `createPatternPropertyKeyValidator()` no longer accepts a string as the `error` parameter. Pass a function `(ctx) => string` instead.
