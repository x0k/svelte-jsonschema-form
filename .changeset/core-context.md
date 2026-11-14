---
"@sjsf/form": major
---

Add a shared `CoreContext` to `@sjsf/form/core`. Helpers that need a validator,
merger, or root schema take it as their first argument instead of separate
arguments:

```ts
const ctx = createCoreContext({ validator, merger, rootSchema });
retrieveSchema(ctx, schema, formData);
```

`FormState` extends `CoreContext`, so a form can be used where a context is
expected. The context operations are also available as free functions taking
the context first: `isValid`, `mergeSchemas`, `mergeAllOf`,
`isValueDeepEqual`, `resolveRef`, and `getRootSchema`.

- `omitExtraData(validator, merger, schema, value)` → `omitExtraData(ctx, value)`
- `experimental_defaultFormStateBehavior.arrayMinItems.computeSkipPopulate`
  receives `(ctx, schema)`; use `isValid(ctx, schema, value)` inside it
- `getDefaultFormState` no longer falls back to its `schema` argument as the
  root schema, and the `rootSchema` defaults-computation option was removed;
  pass the intended root schema to `createCoreContext`

The context stores its dependencies under symbols that are not exported from
`@sjsf/form/core`. Import `CORE_VALIDATOR`, `CORE_MERGER`, and
`CORE_ROOT_SCHEMA` from `@sjsf/form/core/internals` when you build or inspect a
context directly. `FORM_VALIDATOR`, `FORM_MERGER`, and `FORM_SCHEMA` are no
longer exported from `@sjsf/form/internals`; they were aliases of those
symbols.
