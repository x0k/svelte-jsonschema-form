---
"@sjsf/form": major
---

- Make `mappedValue` required on `FormEnumOption`. Use the new `createMappedOption(builder, option)` helper from `@sjsf/form/options.svelte` to create options cleanly.
- Add `createMappedOption(builder, option)` factory function to `@sjsf/form/options.svelte`. It calls `builder.push()` internally and returns a complete `FormEnumOption`.
- Add `resolveEnumValueMapperBuilder(factory?)` helper to `@sjsf/form/options.svelte`. It resolves the enum value mapper builder from a UI option factory, falling back to `StringEnumValueMapperBuilder`.
- Change the default enum value mapper from `IdEnumValueMapperBuilder` to `StringEnumValueMapperBuilder`. If you relied on ID-based mapping, pass `{ enumValueMapperBuilder: () => new IdEnumValueMapperBuilder() }` in your UI options.
