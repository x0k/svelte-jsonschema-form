---
"@sjsf/form": patch
---

Keep array items that sanitizing dropped when switching `anyOf`/`oneOf` options. Object items whose items schema declares no `properties` are kept instead of being cleared with the whole free-form list, an item the items options list (including a `oneOf`/`anyOf` option that lists several values) or a matching items `const` is kept as it is, an array item a new items `const` rejects is dropped, arrays of arrays are sanitized per element rather than left unsanitized, and type lists are compared by what they name, so a `null` a list allows is kept as it is.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5754>
