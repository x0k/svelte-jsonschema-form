---
"@sjsf/form": major
"@sjsf/ajv8-validator": major
"@sjsf/schemasafe-validator": major
"@sjsf/sveltekit3": major
---

Add a shared `CoreContext` to `@sjsf/form/core` and a required, form-scoped
`logger`. Helpers that need a validator, merger, value handler, root schema, or
logger take the context first, and a `FormState` can be used as one:

```ts
const ctx = createCoreContext({
  validator,
  merger,
  valueHandler,
  rootSchema,
  logger,
});
retrieveSchema(ctx, schema, formData);
```

The logger receives schema-resolution warnings, `<Field>` development
diagnostics, and validator failures, so repeated messages are reported once per
form. Use `createLogger` from `@sjsf/form/loggers/once`, or the silent `logger`
from `@sjsf/form/loggers/noop`; pass the factory to `createForm`.

Breaking changes:

- `omitExtraData(validator, merger, schema, value)` → `omitExtraData(ctx, value)`
- `getDefaultFormState` no longer uses its `schema` argument as the root schema;
  pass the root schema to `createCoreContext`
- `defaultFormStateBehavior.arrayMinItems.computeSkipPopulate` receives
  `(ctx, schema)`
- The validator and merger factories, `createCoreContext`, and the
  `@sjsf/sveltekit3` server helpers now take a logger
- Context dependencies moved to `@sjsf/form/core/internals` under `CORE_*`
  symbols; the `FORM_VALIDATOR`/`FORM_MERGER`/`FORM_SCHEMA` aliases are gone
