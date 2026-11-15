---
"@sjsf/form": major
---

Value comparison and copying are now split between a core `ValueHandler` and a
form `FormValueHandler`, instead of living on `Merger`:

- `ValueHandler` in `@sjsf/form/core` only compares with `isValueDeepEqual`.
  `FormValueHandler extends ValueHandler` and adds `copyForChange(value)`, which
  snapshots a value before an in-place write.
- `Merger` only merges schemas and `allOf`; it no longer implements
  `isValueDeepEqual` or `copyForChange`.
- `FormOptions.valueHandler` is required. `MergerFactoryOptions`,
  `ValidatorFactoryOptions`, `IdBuilderFactoryOptions`, and
  `CoreContextOptions` receive a `valueHandler`; a `FormValueHandler` can be
  passed because it extends `ValueHandler`.
- `defaultFormValueHandler` is exported from
  `@sjsf/form/value-handlers/default`; it compares like
  `isSchemaValueDeepEqual` and copies with `copyForChange`. `copyForChange` is
  also exported from `@sjsf/form`.
- `createSchemaValueComparator` helpers stay in `@sjsf/form/core`.
- `ValueDeepComparator` receives `ReadonlySchemaValue | undefined`, so it can
  compare live values from `getValue` without a cast.
- `enumValueMapperBuilder` receives the form state, so builders can compare
  values through `isValueDeepEqual(ctx, a, b)`; `IdEnumValueMapperBuilder` and
  `StringEnumValueMapperBuilder` take the same context.

```ts
export { defaultFormValueHandler as valueHandler } from "@sjsf/form/value-handlers/default";
```
