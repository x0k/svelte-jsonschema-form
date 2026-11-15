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
- `enumValueMapperBuilder` receives a `ValueHandler`; `IdEnumValueMapperBuilder`
  and `StringEnumValueMapperBuilder` require one.

```ts
export { defaultFormValueHandler as valueHandler } from "@sjsf/form/value-handlers/default";
```
