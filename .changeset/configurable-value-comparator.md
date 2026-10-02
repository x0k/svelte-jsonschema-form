---
"@sjsf/form": major
---

Make form value comparison configurable. `Merger` gains a required `isValueDeepEqual`, defaulted to `isSchemaValueDeepEqual`. `@sjsf/form/core` exports `createSchemaValueComparator`, `compareRecords`, `compareOrderedRecords`, `ValueComparer`, `ValueDeepComparator`, `LeafValueComparator` and `RecordsComparator`, so a leaf rule can be swapped without reimplementing the traversal:

```ts
merger: (o) => ({
  ...createFormMerger(o),
  isValueDeepEqual: createSchemaValueComparator(compareRecords, equal),
});
```

Breaking changes:

- `enumValueMapperBuilder` UI option is now `(comparer: ValueComparer) => EnumValueMapperBuilder`, where `comparer` is the form's `Merger`. Pass it to your builder constructor:

  ```ts
  "ui:options": {
    enumValueMapperBuilder: (comparer) => new IdEnumValueMapperBuilder(comparer),
  };
  ```

- `IdEnumValueMapperBuilder` and `StringEnumValueMapperBuilder` now require a `ValueComparer` constructor argument.

  A factory written for the previous zero-argument signature still typechecks, so
  pass `comparer` explicitly rather than dropping the parameter.
