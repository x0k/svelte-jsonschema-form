---
"@sjsf/form": major
---

- The `makeEventHandlers` function signature has been updated
- Added the `hasFieldState` function to check a field’s state
- The `isSubmitted` and `isChanged` properties are now `readonly`
- `isSubmitted` is reset after successful processing (validation + `onSubmit` handler)
- `isChanged` becomes `true` after any interaction before the form is submitted or reset
