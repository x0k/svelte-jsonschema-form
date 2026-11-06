---
"@sjsf/form": minor
---

Add `getValue(form)` for a live, non-copying read of the form value. In a reactive context it tracks only the properties you read; use `getValueSnapshot(form)` when you need a detached copy.
