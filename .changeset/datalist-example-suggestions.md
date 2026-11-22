---
"@sjsf/form": patch
---

Deduplicate `<datalist>` suggestions by their string value and leave out `null`, object and array examples, so an input no longer points at duplicate or unusable suggestions, or at an empty datalist.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5400>
