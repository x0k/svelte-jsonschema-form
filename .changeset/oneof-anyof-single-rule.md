---
"@sjsf/form": major
---

Every reader of a schema's `oneOf`/`anyOf` options now goes through one rule, so the rendered field, its select, its labels, its uiSchema and its defaults all agree on the same list.

- **BREAKING CHANGE:** A schema carrying both `oneOf` and `anyOf` now renders from its `anyOf` throughout. Previously `isSelect()` and the field resolvers read `oneOf` while `getSchemaType()`, `getSchemaDefinition()` and `getUiSchemaByPath()` read `anyOf`, so a field could be rendered from one keyword and titled or typed from the other.
- An empty `oneOf`/`anyOf` no longer shadows a populated sibling. `[]` is truthy, so `{ oneOf: [], anyOf: [{ const: "x" }, { const: "y" }] }` rendered as a select with **zero** options instead of the two its `anyOf` offers.
- A schema whose `oneOf`/`anyOf`/`allOf` list is empty no longer throws `Unsupported schema types: empty type array` for every field config. An empty list offers no type to take, so the schema is handled through its own type and renders as `unknownField`.
- `getSchemaDefinitionByPath()` now descends into a schema's `allOf` members _and_ its rendered `oneOf`/`anyOf` options, so a property declared in one group is found when the other group is also present. Reading a single group and stopping once it yielded nothing meant a property declared solely in `allOf` resolved to `undefined` — taking its schema, its defaults and its id with it.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5350>
