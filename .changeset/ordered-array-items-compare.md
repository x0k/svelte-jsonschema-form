---
"@sjsf/form": patch
---

Fix `isOrderedSchemaDeepEqual` ignoring key order inside array items. The comparator recursed into arrays with `isSchemaValueDeepEqual` — the key-order-insensitive comparator — instead of the comparator it was built from, so record keys were compared in order while records nested in arrays were not. Array items are now compared with the same ordered comparator, which is what the function name promises.

The only two consumers are `isConfigEqual` and the `schemaProperties` cache of the object field context, so the visible effect is limited to change detection for schemas that carry arrays of objects: a field whose tuple items come back with a different key order is now reported as changed rather than reused, and the object context re-runs defaults injection for it. Both are conservative directions — the comparator can only report "changed" more often, never less. No value is dropped or rewritten as a result.
