---
"@sjsf/form": patch
---

Stop scoring a recursive `$ref` once the form data has no value left for it, which could previously overflow the stack.

This also changes the scores returned by the public `calculateIndexScore()` helper for `$ref` properties whose form data is absent: those properties no longer contribute to the score.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5353>
