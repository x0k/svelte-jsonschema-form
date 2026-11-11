---
"@sjsf/form": patch
---

Keep array items that sanitizing dropped when switching `anyOf`/`oneOf` options. Object items whose items schema declares no `properties` are kept instead of being cleared with the whole free-form list, an item the items options list or a matching items `const` is kept as it is, an array item a new items `const` rejects is dropped, and arrays of arrays are sanitized per element rather than left unsanitized.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5754>
