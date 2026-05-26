# @sjsf/sveltekit

## Commands

```bash
pnpm test              # vitest run (unit tests only)
pnpm run test:unit     # vitest (watch mode)
pnpm run test:integration  # playwright test (builds + previews app first)
pnpm run build         # svelte-package && vite build && publint
pnpm run check         # svelte-kit sync && svelte-check
pnpm run lint          # prettier --check . && eslint .
pnpm run format        # prettier --write .
```

Run from repo root: `pnpm run test --filter @sjsf/sveltekit`, `mk kit/t`, etc.

## Two Integration Modes

### Classic SvelteKit Form Actions (`client/` + `server/`)

- **Server**: `createFormHandler(schema, validator, ...)` → parses FormData, validates, returns `ValidatedFormData<T>` (discriminated union on `isValid`). `createAction()` wraps it as a SvelteKit action with `fail()`.
- **Client**: `createSvelteKitForm()` creates a form with `createForm()`, uses `$effect` to reactively apply server validation results from `page.form`. `createSvelteKitRequest()` implements `use:enhance` logic manually (serializes to JSON chunks, fetches POST, calls `applyAction`/`invalidateAll`). `setupSvelteKitForm()` combines both. `<SvelteKitForm>` is the convenience component.
- **`createMeta<ActionData, PageData>()`**: Type-safe proxy providing autocomplete for form names.

### SvelteKit Remote Functions (`rf/` — experimental)

- Requires `experimental: { remoteFunctions: true }` in `svelte.config.js` and `experimental.async: true` in `compilerOptions`.
- **Server**: `createServerValidator()` returns a Standard Schema v1 validator (`~standard` property). Used with SvelteKit's `form()` from `$app/server`.
- **Client**: `connect(remoteForm, options)` returns `Promise<FormOptions<T>>`. Attaches to the remote form's DOM, uses `hydratable()` for SSR-compatible initial value resolution, proxies `uiSchema` to inject `action`/`method`. On submit, creates hidden inputs + hidden form, calls `requestSubmit()`.
- **`createClientValidator()`**: Wraps `@sjsf/form`'s `validate()` as a Standard Schema v1 validator.

## Source Layout

```
src/lib/
  index.ts              # Re-exports model + id-builder
  model.ts              # Core types (InitialFormData, ValidatedFormData, Codec, EntryConverter, constants)
  internal.ts           # Shared: PickOptionalSerializable, compilePatterns, chunks generator
  id-builder.ts         # Classic mode FormIdBuilder
  client/
    index.ts            # Barrel
    form.svelte.ts      # createSvelteKitForm, setupSvelteKitForm
    request.svelte.ts   # createSvelteKitRequest (use:enhance replacement)
    meta.ts             # createMeta (type-safe form metadata proxy)
    additional-property-key-validator.ts
    simple-form.svelte  # <SvelteKitForm> convenience component
  server/
    index.ts            # Barrel
    server.ts           # createFormHandler, createAction, isValid
  internal/
    schema-value-parser.ts   # Classic FormData → form value (flat entries)
    codec.ts                 # Classic name encoding (~-escape, radix-36)
    convert-form-data-entry.ts  # EntryConverter for type coercion + enum decoding
  rf/
    index.ts            # Re-exports rf/id-builder
    id-builder.ts       # RF mode FormIdBuilder (different encoding for Record keys)
    client/
      index.ts          # Barrel
      client.svelte.ts  # connect(), createClientValidator()
    server/
      index.ts          # Barrel
      server.ts         # createServerValidator()
      translation.ts    # Server-side error translation (en, ru)
    internal/
      codec.ts               # RF name encoding (X-prefix, base-36)
      schema-value-parser.ts # RF Record → form value (nested records)
      sveltekit-data-parser.ts  # Bridges RF parser to form infra
src/routes/              # Demo/playground app (not published)
```

## Architecture Notes

- **Dual codec + dual parser**: Classic mode works with flat `FormData` entries; RF mode works with nested `Record<string, unknown>`. They share `model.ts`, `internal.ts`, and `convert-form-data-entry.ts` but have separate ID builders, codecs, and schema-value parsers.
- **JSON chunking**: Form values are serialized to JSON, split into ~500KB chunks (`JSON_CHUNKS_KEY`), and sent as multiple FormData entries. Files use `FORM_DATA_FILE_PREFIX` placeholders in JSON; actual `File` objects are appended separately.
- **`src/routes/`** is a demo app (not published).

## Config Quirks

- **`svelte-kit sync`** is required before `svelte-check` (handled by `check` script).
- **`experimental.remoteFunctions: true`** in `svelte.config.js` — enables the `form()` API.
- **`experimental.async: true`** in compilerOptions — needed for `hydratable()` in RF client `connect()`.
- **`.js` extensions in imports**: All TS imports use `.js` extension (standard SvelteKit ESM convention).
- **ESLint disable**: `/* eslint-disable @typescript-eslint/no-explicit-any */` is used at the top of files that need `any` (server.ts, form.svelte.ts, request.svelte.ts).
- **No `$:` reactive declarations** — strictly Svelte 5 runes mode.
- **`_` prefix for unused vars** (monorepo convention).

## Exports

| Sub-path      | Content                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `.`           | Types (ValidatedFormData, InitialFormData, Codec) + classic FormIdBuilder                            |
| `./client`    | createSvelteKitForm, setupSvelteKitForm, createSvelteKitRequest, createMeta, SvelteKitForm component |
| `./server`    | createFormHandler, createAction, isValid                                                             |
| `./rf`        | RF mode FormIdBuilder                                                                                |
| `./rf/client` | connect, createClientValidator                                                                       |
| `./rf/server` | createServerValidator, server translations                                                           |
