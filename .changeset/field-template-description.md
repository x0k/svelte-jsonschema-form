---
"@sjsf/form": minor
---

Show the selected `oneOf`/`anyOf` option's description in single-value select fields.

- `fieldTemplate` and `optionalFieldTemplate` accept an optional `description` prop. It is used when `ui:options.description` is not set and takes precedence over the schema description.
- `enumField`, `remoteEnumField`, `objectKeyEnumField`, and `booleanSelectField` pass the selected option's description to their template. Multi-selects and fields with a hidden title do not render it.
