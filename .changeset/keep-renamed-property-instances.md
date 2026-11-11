---
"@sjsf/form": patch
---

Keep every renamed `additionalProperties` key's field instance instead of only the most recently renamed one. Renaming another key no longer remounts the earlier fields and loses their widget state.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5733>
