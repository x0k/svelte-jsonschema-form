---
"@sjsf/form": major
---

Replace form submission with validation:

- `FormSubmission` → `FormValidation` (`[SubmitEvent]` → `[FormValue]`); `form.submission` → `form.validation`; `submissionCombinator/DelayedMs/TimeoutMs` → `validationCombinator/DelayedMs/TimeoutMs`
- `onSubmit(value, e)` / `onSubmitError(result, e, form)` / `onSubmissionFailure(state, e)` / `onReset(e)` → `onValid(value)` / `onInvalid(result)` / `onValidationProcessError(error)`; `onFieldsValidationFailure` → `onFieldsValidationProcessError`
- `form.submit(e)` / `form.reset(e)` and `form.isSubmitted` / `form.isChanged` removed — use `validate(form, handlers)` / `reset(form)` with `handlers(form)` attachment
- `AFTER_SUBMITTED` → `AFTER_VALIDATED` (gated on `validation.status === "idle"`); `FIELD_SUBMITTED` removed
- `validate(ctx)` / `validateAsync(ctx, signal)` → `validateFormValue(ctx)` / `validateFormValueAsync(ctx, signal)`
- Add `Task.clear()` (silent cancel to `idle`, without `onFailure`); `abort()` still reports `aborted` failure
- `preventPageReload({ isChanged })` → `preventPageReload(() => boolean)` (getter callback)
