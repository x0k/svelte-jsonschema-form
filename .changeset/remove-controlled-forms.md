---
"@sjsf/form": major
---

Remove the controlled `value` form option. The form owns its value: seed it with `initialValue`, replace it with `setValue`, edit it with `setValueAtPath`, `updateValueAtPath`, and the array commands, and restore `initialValue` with `reset(form)`. `Bind` and `refFromBind` are removed from `@sjsf/form/lib/svelte.svelte`.

Add the `setValueAtPath` command for replacing a value at a field path, the `updateValueAtPath` command for in-place object updates whose callback value type can be narrowed, and the `insertArrayItem`, `removeArrayItem`, `moveArrayItem`, and `swapArrayItems` commands for structural array changes that keep item keys in sync. These commands accept an `RPath` (a plain array) and cache the corresponding `FieldPath` internally; a registered `FieldPath` is used as-is without a lookup. The array commands ignore indices that are not integers, in addition to out-of-bounds indices.

`getId`, `getPseudoId`, `getSubtreePaths`, `getChildPath`, and `getPseudoPath` now accept an `RPath` and canonicalize it internally. `getIdByPath` and `getPseudoIdByPath` are removed; use `getId` and `getPseudoId` instead.

The `ByPath` variants of the error and field-state helpers are removed. `getFieldErrors`, `getFieldsErrors`, `updateFieldErrors`, `hasFieldState`, and `setFieldState` accept an `RPath` directly and cache the corresponding `FieldPath` internally; a registered `FieldPath` is used as-is without a lookup.

Remove the `keyedArraysMap` form option. Use the array commands instead of mutating a keyed array retrieved from the form.
