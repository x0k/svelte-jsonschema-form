---
"@sjsf/form": major
---

Combination fields now own their title, description and action instead of
leaving them to the selected branch.

- A branch uses its own `oneOf`/`anyOf`/`union` UI schema entry and no longer
  falls back to the parent UI schema. Put branch-specific options and
  components in that entry.
- For an object combination, the parent `ui:options` and `ui:components` apply
  to the field that renders the shared `properties`.
- `multiFieldTemplate` and `optionalMultiFieldTemplate` now require a
  `showMeta` prop.
