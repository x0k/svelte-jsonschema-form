---
"@sjsf/form": minor
---

Schemas that list multiple types (`type: ["string", "number"]`) now render a
type selector, with the field for the selected type below it. Switching types
casts the value when possible and clears it otherwise. A single nullable type
and values pinned by `enum` or `const` keep their plain field. Label and
configure each type with the `union` UI schema keyword.

Multi-field templates now render the field title and description above the
option selector.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5323>
