# 0011. Combination fields own their meta

## Decision

A combination field (`oneOfField`, `anyOfField`, `unionField`) owns the field's
title, description and action. Exactly one child renders that meta:

- When the parent schema is an object, the field for its shared properties is a
  normal object field built from the parent config with only the
  `oneOf`/`anyOf` key removed. It keeps the parent's title, description and
  full UI schema, so `ui:options` and `ui:components` apply to the shared
  properties. The multi-field template receives `showMeta={false}`, so it does
  not repeat the meta.
- Otherwise (a union, or a non-object `oneOf`/`anyOf`), there is no
  shared-properties field and the multi-field template renders the meta.

In both cases the value field for the selected branch or type describes only
that value:

- A branch is configured by its own `oneOf`/`anyOf`/`union` UI schema entry.
  There is no fallback to the parent UI schema for a branch without an entry.
- The branch schema has the parent's `title` and `description` removed.
- `getUnionValueSchema()` drops `title` and `description` from the pinned value
  schema for the same reason.

The multi-field template renders that meta only when `showMeta` is `true`. The
prop is required, so custom multi-field templates must accept it. It is not a
Svelte context flag, so it does not leak into nested fields that share the
path.

## Why

The parent UI schema must keep configuring the parent field. Stripping
`ui:options` and `ui:components` from the shared-properties field made options
such as `order`, `expandable` and `additionalPropertyKey`, and the object
components, impossible to set for those properties. Keeping the full config on
that field makes it an ordinary object field again and puts every option where
the user wrote it.

Once that field keeps the parent annotations, it is also the natural place to
render the parent meta. Hiding it in the multi-field template with
`showMeta={false}` avoids duplicate titles and descriptions without injecting
synthetic `description: ""` values or maintaining a suppression list of UI
schema keys.

## Consequences

The shared-properties field renders the action slot through its object field,
so the wrapper's typed actions (`actions.oneOfField` / `actions.anyOfField`) are
not routed to it yet; the generic `ui:options.action` still is. Routing them
would need an explicit hint on `Config`, which is deliberately deferred.

## Rejected alternatives

- Injecting `ui:options.description: ""` into child UI schemas. It fixes the
  current description but turns every meta option into a special case in the
  combination context and leaves the child data dishonest.
- Adding a `Config.description` render-time override. It would mirror the
  existing `title: ""` override, but it creates a second description channel
  and leaves the parent's annotation on the child schema.
- Falling back to the parent UI schema for branches and stripping only
  `description`. The parent UI schema also carries `action`, `help` and
  `ui:components`, so the suppression list would keep growing.
- A Svelte context flag that tells child templates to skip meta. It is implicit,
  invisible to custom templates, and leaks into nested fields sharing the path.

Ports <https://github.com/rjsf-team/react-jsonschema-form/pull/5323>.
