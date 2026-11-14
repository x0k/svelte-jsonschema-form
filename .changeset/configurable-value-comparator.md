---
"@sjsf/form": major
---

Value comparison is now a required `Comparator` service instead of part of
`Merger`:

- `Merger` only merges schemas and `allOf`.
- `FormOptions.comparator` is required. `MergerFactoryOptions`,
  `ValidatorFactoryOptions`, `IdBuilderFactoryOptions`, and
  `DropStaleDefaultsOptions` receive it.
- `defaultComparator` is exported from `@sjsf/form/comparators/default`; the
  `createSchemaValueComparator` helpers stay in `@sjsf/form/core`.
- `enumValueMapperBuilder` receives a `Comparator`; `IdEnumValueMapperBuilder`
  and `StringEnumValueMapperBuilder` require one.

```ts
export { defaultComparator as comparator } from "@sjsf/form/comparators/default";
```
