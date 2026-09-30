---
"@sjsf/form": patch
---

Fix `isOrderedSchemaDeepEqual` ignoring key order inside array items: it recursed into arrays with the unordered comparator, so only record keys outside arrays were compared in order. Affects change detection only, and can now report a schema as changed more often, never less.
