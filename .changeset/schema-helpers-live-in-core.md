---
"@sjsf/form": major
---

The schema helpers live only in `@sjsf/form/core`, and the schema predicates say what they read.

- **BREAKING CHANGE:** `isSelect`, `isMultiSelect` and `isFilesArray` are renamed to `isSelectSchema`, `isMultiSelectSchema` and `isFilesArraySchema` in `@sjsf/form/core`.
- **BREAKING CHANGE:** `isSchemaOfConstantValue` is renamed to `isConstantValueSchema` in `@sjsf/form/core`.
- **BREAKING CHANGE:** `isFixedItems` is renamed to `isFixedItemsSchema` in `@sjsf/form/core`.
- **BREAKING CHANGE:** `@sjsf/form` no longer re-exports `isSelect`, `isMultiSelect`, `isFilesArray`, `retrieveSchema`, `sanitizeDataForNewSchema`, `getClosestMatchingOption` or `getRenderedOptionSchema` from the form-state module. Import them from `@sjsf/form/core` and pass a `CoreContext` or `FormState` as the first argument.
- `getRenderedOptionSchema` is now exported from `@sjsf/form/core`.
