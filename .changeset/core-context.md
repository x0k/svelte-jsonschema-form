---
"@sjsf/form": major
---

Add a shared `CoreContext` for the schema helpers exported from
`@sjsf/form/core`. It holds the validator, merger, and root schema, and the
helpers that need those dependencies take it as their first argument instead of
separate `validator`, `merger`, and `rootSchema` arguments. Build one with
`createCoreContext({ validator, merger, rootSchema })`, or pass a `FormState`,
which now extends `CoreContext`.

The context dependencies are stored under internal symbols that are not
exported from `@sjsf/form/core`. Import them from `@sjsf/form/core/internals`
when you build or inspect a context directly. The helpers access them through
the free functions `isValid(ctx, schema, value)`, `mergeSchemas(ctx, a, b)`,
`mergeAllOf(ctx, schema)`, `isValueDeepEqual(ctx, a, b)`,
`resolveRef(ctx, ref)`, and `getRootSchema(ctx)`.

`FORM_VALIDATOR`, `FORM_MERGER`, and `FORM_SCHEMA` are no longer exported from
`@sjsf/form/internals`. They were aliases of the same symbols; use
`CORE_VALIDATOR`, `CORE_MERGER`, and `CORE_ROOT_SCHEMA` from
`@sjsf/form/core/internals`.

Update direct core calls such as
`retrieveSchema(validator, merger, schema, rootSchema, formData)` to
`retrieveSchema(ctx, schema, formData)`. `resolveRef` now also takes the context
first: `resolveRef(ctx, ref)`. The `experimental_defaultFormStateBehavior`
`arrayMinItems.computeSkipPopulate` callback receives `(ctx, schema)` instead of
`(validator, schema, rootSchema)`; use `isValid(ctx, schema, value)` inside it.
The `rootSchema` option was also removed from the defaults-computation props;
the context supplies it. `getDefaultFormState` no longer defaults the root
schema to the schema it receives; build the context with the intended root
schema.
