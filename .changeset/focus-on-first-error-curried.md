---
"@sjsf/form": major
---

Curry the focus-on-first-error handler around the submit event:

- `createFocusOnFirstError(options?) => (result, e, form)` → `createFocusOnFirstError({ ...options, form }) => (e: SubmitEvent) => (result)`; the `FormState` is now bound at creation time and the native `SubmitEvent` (focus scope via `e.target`) is bound per submission, so the returned callback fits `validate(form, { onInvalid })` which receives only the validation result
- Migration: `createFocusOnFirstError()(result, e, form)` → `createFocusOnFirstError({ form })(e)(result)`, typically as `onInvalid: focusOnFirstError(e)` inside a custom `onsubmit` handler
- Example helper `createTabbedFocusOnFirstError(ctx, options?) => (result, e, form)` → `createFocusOnFirstErrorTab(ctx) => (focus) => (result)` (composable wrapper, e.g. `onInvalid: focusOnFirstErrorTab(focusOnFirstError(e))`)
