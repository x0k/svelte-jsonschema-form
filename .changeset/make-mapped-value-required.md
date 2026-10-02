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
- `idMapper()` — use `retrieveEnumValueMapperBuilder()` + `builder.build()`.
- `isSchemaExpandable()` — use `isObjectSchemaExpandable()`.
- `UNDEFINED_ID` — use `EMPTY_VALUE` instead.

New helpers:

- `createMappedOption(builder, option)` — creates a `FormEnumOption` with `mappedValue` populated.
- `retrieveEnumValueMapperBuilder(ctx, config)` — resolves the builder from the `enumValueMapperBuilder` UI option, defaults to `StringEnumValueMapperBuilder`.
