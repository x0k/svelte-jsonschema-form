---
"@sjsf/form": major
---

Breaking changes:

- `FormEnumOption.mappedValue` is now required. Use `createMappedOption(builder, option)` from `@sjsf/form/options.svelte`.
- `Options.mapper`, `SingleSelectOptions.clearable`, `SingleSelectOptions.mapped`, `MultiSelectOptions.mapped` are now required.
- `ArrayContextOptions.setValue` is now required.
- `singleOption()` and `multipleOptions()` no longer return a deprecated `.value` property (use `.current`).
- `SingleSelectOptions.hasInitialValue` removed (was deprecated in favor of `clearable`).
- Default enum mapper changed from `IdEnumValueMapperBuilder` to `StringEnumValueMapperBuilder`.

Removed deprecated APIs:

- `createOptions()` — use `createFormOptions()` instead.
- `idMapper()` — use `resolveEnumValueMapperBuilder()` + `builder.build()`.
- `isSchemaExpandable()` — use `isObjectSchemaExpandable()`.

New helpers:

- `createMappedOption(builder, option)` — creates a `FormEnumOption` with `mappedValue` populated.
- `resolveEnumValueMapperBuilder(factory?)` — resolves builder from UI option, defaults to `StringEnumValueMapperBuilder`.
