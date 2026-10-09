# @sjsf/sveltekit3

## 3.9.0

### Minor Changes

- Add `@sjsf/sveltekit3`, the SvelteKit 3 integration. `@sjsf/sveltekit` is now a legacy package for SvelteKit 2. ([#479](https://github.com/x0k/svelte-jsonschema-form/pull/479))

  `FormIdBuilder` gained an optional `idPrefixName()` hook, so integrations can rename the hidden input that carries the form id prefix.

### Patch Changes

- Fix the FormData submission path crashing the page on a form with a file field. Every untouched `<input type="file">` reports `File("")`, which `connect()` copied into the submission form through a `DataTransfer`. That file was built in script rather than chosen by the user, so Chromium terminates the renderer that uploads one (`bad IPC message, reason 2`), which reads to Playwright as an empty field or a page crash. The empty part carried nothing — `convertFormDataEntry` drops it — so it is now left out, as the JSON path already did. ([#484](https://github.com/x0k/svelte-jsonschema-form/pull/484))
