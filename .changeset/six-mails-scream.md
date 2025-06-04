---
"@sjsf/form": major
---

Refactor action logic:

- `run` methods now returns `void`
- Added `runAsync` method that returns `Promise<R>`
- Fixed `state_referenced_locally` warning
