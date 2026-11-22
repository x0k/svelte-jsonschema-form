---
"@sjsf/form": major
"@sjsf/ajv8-validator": major
"@sjsf/schemasafe-validator": major
"@sjsf/sveltekit3": major
---

Add `CoreContext` to `@sjsf/form/core` and make `logger` a required form option.

Core helpers that need shared dependencies now take a `CoreContext` as their
first argument. A `FormState` can be passed in its place, and
`createCoreContext(options)` builds a standalone one:

```ts
const ctx = createCoreContext(options);
retrieveSchema(ctx, schema, formData);
```

Warnings and errors raised by the form and its helpers go through the logger.
`createLogger` from `@sjsf/form/loggers/once` reports each distinct message
once; `logger` from `@sjsf/form/loggers/noop` discards diagnostics. Pass the
factory when the logger keeps per-form state.

Breaking changes:

- `omitExtraData(validator, merger, rootSchema, value)` → `omitExtraData(ctx, value)`
- `getDefaultFormState` no longer uses its `schema` argument as the root schema;
  pass the root schema to `createCoreContext`
- `defaultFormStateBehavior.arrayMinItems.computeSkipPopulate` receives
  `(ctx, schema)`
- The validator, merger, and ID builder factories, `createCoreContext`, and the
  `@sjsf/sveltekit3` server helpers now take `logger`
- Context dependencies moved to `@sjsf/form/core/internals` under `CORE_*`
  symbols; the `FORM_VALIDATOR`/`FORM_MERGER`/`FORM_SCHEMA` aliases are gone
