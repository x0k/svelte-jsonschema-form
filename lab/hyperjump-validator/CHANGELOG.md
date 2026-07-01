# @sjsf-lab/hyperjump-validator

## 3.1.0

### Minor Changes

- [BREAKING] Removed `localization` option — error messages are now localized automatically via `@hyperjump/json-schema-errors`. Use `locale` option instead (e.g., `createFormValidatorFactory({ ast, locale: "en-US" })`). ([#410](https://github.com/x0k/svelte-jsonschema-form/pull/410))

- Export `fromAst` helper function ([#394](https://github.com/x0k/svelte-jsonschema-form/pull/394))

## 3.0.0

### Major Changes

- Add `@sjsf-lab/hyperjump-validator` package ([#364](https://github.com/x0k/svelte-jsonschema-form/pull/364))
