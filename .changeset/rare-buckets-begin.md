---
"@sjsf/form": major
---

Refactor form API:

- Renames:
  - `form.validation` -> `form.submission`
  - `validationCombinator` -> `submissionCombinator`
  - `validationDelayedMs` -> `submissionDelayedMs`
  - `validationTimeoutMs` -> `submissionTimeoutMs`
- `form.submit` now returns `void`
