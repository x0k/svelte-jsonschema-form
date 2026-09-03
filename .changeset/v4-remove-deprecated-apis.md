---
"@sjsf/form": major
---

Removed deprecated APIs:

- `FormErrorsMap` type — use `SvelteMap<FieldPath, string[]>` directly.
- `setFormContext2` — use `setFormContext` instead.
- `KeyedArray2` type — use `KeyedArray` instead.
- `validateByRetrievedSchema` option — use `retrieveSchema` from `@sjsf/form/core` in your validator extension instead.
- `DEFAULT_AUGMENT_SUFFIX` constant — use `idAugmentations` on `FragmentSchemaOptions` instead.
- `augmentSuffix` option on `FragmentSchemaOptions` — use `idAugmentations` instead.
- `Query.result` — use `Query.current` instead.
- `getSelectOptionValues()` — use `getSelectOptionValuesSafe()` instead.
- `@sjsf/form/fields/any-of` — use `@sjsf/form/fields/combination/any-of` instead.
- `@sjsf/form/fields/one-of` — use `@sjsf/form/fields/combination/one-of` instead.
- `@sjsf/form/fields/combination` — use `@sjsf/form/fields/combination/combination` instead.

Other breaking changes:

- `Config.value` is now required (no longer optional).
