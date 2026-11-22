# 0010. Render type unions through the combination field

## Decision

A schema that allows more than one type (`type: ["string", "number"]`) renders
through `unionField`, a field built on the same `Combination` component as
`oneOfField` and `anyOfField`. `createUnionCombinationContext()` offers the
listed types in a selector built from the existing multi-field template, pins
the selected type into the value schema with `getUnionValueSchema()`, and lets
the resolver choose the field for that schema. The `basic` and `compat`
resolvers route such schemas to `unionField` before `oneOf`/`anyOf`, after the
select, `enum` and `const` checks that pin a value to a type. The `union`
keyword in the UI schema holds one entry per listed type; an entry labels the
type in the selector and configures the field the type renders.

The helpers live in `core/union.ts`: `getUnionTypes()` and `isUnionSchema()`
decide what the resolvers route, while `castToUnionType()`,
`canUnionTypeShowData()`, `getInitialUnionTypeIndex()` and
`getUnionValueSchema()` handle the value and the pinned schema. A nullable
single type (`type: ["string", "null"]`) is not a union, and neither is a
schema whose value is pinned by `enum` or `const`.

## Why

`oneOf`/`anyOf` already solves the same UI problem: a selector over alternatives
and a field for the chosen one. Reusing its template, pseudo path and option
mapping keeps the type selector's markup, ids and theming consistent with the
option selector, and avoids a second implementation of the same interaction.
Keeping the union value schema's other keywords means a union's `properties`,
`items`, `format` and its `oneOf`/`anyOf` still describe the value; only `type`
changes. That is also what lets the type selector wrap the option selector
instead of replacing it.

## Rejected alternatives

- A standalone `unionField` with its own selector component and UI option. It
  duplicated the combination field's selector, pseudo path and option wiring,
  and it had no place to apply a per-type UI schema.
- Rendering the first listed type and leaving the others unreachable, as the
  resolvers did before. That silently hides valid data shapes the schema
  accepts.
- Building the value schema from the selected type alone. It drops the
  schema's own properties and constraints, so the field stops validating what
  the schema says.
- Casting values with `String()`/`Number()`/`Boolean()`. Their coercions invent
  data (`[object Object]`, `0` for blank text, `true` for `"false"`) that the
  user never entered and that can satisfy `required` or range constraints.

Ports <https://github.com/rjsf-team/react-jsonschema-form/pull/5323>.
