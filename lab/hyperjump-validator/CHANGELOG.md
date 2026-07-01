# @sjsf-lab/hyperjump-validator

## 3.1.0

### Minor Changes

- [BREAKING] Removed `localization` option — error messages are now localized automatically via `@hyperjump/json-schema-errors`. Use `locale` option instead (e.g., `createFormValidatorFactory({ ast, locale: "en-US" })`). ([`21c737c`](https://github.com/x0k/svelte-jsonschema-form/commit/21c737ccf4de031836ea4ce590da5c325162b812))

- Export `fromAst` helper function ([`21c737c`](https://github.com/x0k/svelte-jsonschema-form/commit/21c737ccf4de031836ea4ce590da5c325162b812))

## 3.0.0

### Major Changes

- Add `@sjsf-lab/hyperjump-validator` package ([#364](https://github.com/x0k/svelte-jsonschema-form/pull/364))
