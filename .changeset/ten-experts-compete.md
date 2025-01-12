---
"@sjsf/form": minor
---

Add `createForm3` function

## Migration

- Replace `useForm2` with `createForm3`.
- If custom form is used it should call `setFormContext(form.context)` before using `FormContent` and `SubmitButton` components.
