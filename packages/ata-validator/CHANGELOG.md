# @sjsf/ata-validator

## 3.9.1

### Patch Changes

- The `precompile` entry no longer builds its format predicates with `new Function` at import time, which threw where dynamic code is refused (a page under a Content-Security-Policy without `unsafe-eval`), the page a precompiled validator is for. The predicates are plain functions carrying their regular expressions, which `bundleStandalone` embeds as before; a test keeps them equal to the runtime `COLOR_FORMAT_REGEX` and `DATA_URL_FORMAT_REGEX`. ([#488](https://github.com/x0k/svelte-jsonschema-form/pull/488))

## 3.9.0

No changes in this release.

## 3.8.2

No changes in this release.

## 3.8.1

## 3.8.0

### Minor Changes

- Stabilize `@sjsf-lab/ata-validator` package ([#425](https://github.com/x0k/svelte-jsonschema-form/pull/425))

## 3.2.0

### Minor Changes

- Export `DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS` from `precompile` module ([#390](https://github.com/x0k/svelte-jsonschema-form/pull/390))

- [BREAKING] Bump minimum required version of `ata-validator` to `0.21.0` ([#390](https://github.com/x0k/svelte-jsonschema-form/pull/390))

### Patch Changes

- Make `CompiledValidator` type more permissive ([#390](https://github.com/x0k/svelte-jsonschema-form/pull/390))

- Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5137> ([#408](https://github.com/x0k/svelte-jsonschema-form/pull/408))

## 3.1.1

### Patch Changes

- Fix `cloneValue` implementation for proxied values ([#384](https://github.com/x0k/svelte-jsonschema-form/pull/384))

## 3.1.0

### Minor Changes

- Bump minimal required version of `ata-validator` to `0.13.1` ([#382](https://github.com/x0k/svelte-jsonschema-form/pull/382))

### Patch Changes

- Use deep clone before validation to avoid input mutations ([#382](https://github.com/x0k/svelte-jsonschema-form/pull/382))

## 3.0.0

### Major Changes

- Add `@sjsf-lab/ata-validator` package ([#374](https://github.com/x0k/svelte-jsonschema-form/pull/374))
