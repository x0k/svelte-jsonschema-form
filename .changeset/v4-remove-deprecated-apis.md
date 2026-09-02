---
"@sjsf/form": major
---

Removed deprecated APIs:

- `FormErrorsMap` type — use `SvelteMap<FieldPath, string[]>` directly.
- `setFormContext2` — use `setFormContext` instead.
- `KeyedArray2` type — use `KeyedArray` instead.
- `validateByRetrievedSchema` option — use `retrieveSchema` from `@sjsf/form/core` in your validator extension instead.

Other breaking changes:

- `Config.value` is now required (no longer optional).
