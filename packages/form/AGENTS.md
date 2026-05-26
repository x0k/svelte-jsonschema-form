# @sjsf/form

## Commands

```bash
pnpm test              # vitest run --typecheck (typecheck + unit tests)
pnpm run bench         # vitest bench
pnpm run build         # svelte-package && publint
pnpm run check         # svelte-check
pnpm run lint          # prettier --check . && eslint .
pnpm run format        # pretttier --write .
```

Run from repo root: `pnpm run test --filter @sjsf/form`, `mk f/t`, etc.

## Source Layout

```
src/
  form/           # Core form engine — createForm, Form/BasicForm/SimpleForm components, state, internals
  core/           # Schema/value/type primitives (no Svelte deps) — Validator, Merger, RPath, Schema types
  fields/         # Field components (string, integer, boolean, array/, object/, extra/)
  templates/      # Template components (field, object, array, multi-field, extra/)
  theme/          # Base theme resolver (fromRecord of field+template definitions)
  lib/            # Shared utilities — json-schema/, resolver, snippet, trie, cache, svelte helpers
  validators/     # Standard Schema adapter, precompile, noop, file-size validators
  mergers/        # Legacy + modern schema merger factories
  id-builders/    # Legacy + modern form ID builder factories
  converters/     # Draft 2020-12 schema converter
  translations/   # en, ru
```

## Architecture

- **Dual entry point**: `@sjsf/form` (svelte condition → `index.ts` with components) vs `@sjsf/form/main` (default → `main.ts`, types + logic only, no Svelte components). Both are barrel exports from `src/form/`.
- **Resolver pattern**: Themes, translations, icons, and extra UI options all use `Resolver<C, R>` — a function `(type, config) => result`. Compose with `chain()`, `fromRecord()`, `fromFactories()`, `overrideByRecord()`, `extendByRecord()`.
- **Module augmentation**: Component types are built up via `declare module` augmentation scattered across `fields.ts`, `widgets.ts`, `templates.ts`, `components.ts`, `ui-options.ts`. Side-effect imports in `exports.ts` files ensure augmentations are loaded.
- **`Ref<T>` wrapper**: `$state` is never exposed directly in the public API. Always wrapped as `{ get current(); set current(v) }`.
- **`Creatable<Result, Options>`**: Factory/value union type — pass a factory `(opts) => R`, a zero-arg `() => R`, or a direct `R`.
- **Symbol-keyed context**: `FormState<T>` properties are accessed via Symbol keys (e.g. `FORM_CONTEXT`, `FORM_VALUE`). Prevents accidental external access.
- **`*-include.ts` pattern**: Extra field `.svelte` components each have a paired `*-include.ts` that imports module augmentations and re-exports the component for standalone sub-path imports.
- **Bitfield flags**: `FieldsValidationMode` and `FieldState` use bit shifts (`ON_INPUT = 1 << 0`, `ON_CHANGE = 1 << 1`, etc.) checked with bitwise AND.
- **Task abstraction**: `task.svelte.ts` provides `Task<T,R,E>` with state machine (idle → processing → success/failed) and `TasksCombinator` strategies (abortPrevious, waitPrevious, forgetPrevious). Used for form submission and field validation.

## Svelte 5 Conventions

- **Runes mode only**: `compilerOptions: { runes: true }` — no `$:` reactive declarations anywhere.
- **File suffixes**: `.svelte.ts` for non-component TS files that use runes (`create-form.svelte.ts`, `task.svelte.ts`, `options.svelte.ts`, `svelte.svelte.ts`). The compiler only processes runes in `.svelte` or `.svelte.ts`/`.svelte.js` files.
- **`$state.raw`**: Used for propagator counters (e.g. `SimpleKeyedArray` reads a raw counter explicitly to trigger dependency without deep observation).
- **`SvelteMap`** from `svelte/reactivity` instead of native `Map` for reactive collections.
- **`$derived.by`** for complex derivations with side effects.

## Config Quirks

- **`kit.files.lib: "src"`**: Library source is at `src/`, not the default `src/lib/`.
- **`@/` path alias**: Maps to `./src/` (in both `svelte.config.js` and `tsconfig.json`).
- **`ignoreSourceErrors: true`**: Vitest typecheck ignores `.svelte` source errors because tsc cannot parse them.
- **NodeNext module resolution**: `tsconfig.json` uses `"module": "NodeNext"`.

## Testing

- Tests are **co-located** with source files (`*.test.ts`).
- Type-level tests use `*.test-d.ts` (run via `vitest run --typecheck`).
- Benchmarks use `*.bench.ts` (run via `vitest bench`).
- `vitest-setup.ts` imports `@testing-library/jest-dom/vitest`.
- Core test helpers: `src/core/test-validator.ts` and `src/core/test-merger.ts` provide simple mock `Validator`/`Merger` implementations for unit tests.
- Async task tests use `vi.useFakeTimers()` / `vi.restoreAllMocks()`.

## Exports Map (key sub-paths)

| Sub-path                                              | Content                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `.`                                                   | All types + `createForm` + Svelte components (Form, BasicForm, SimpleForm, Field, Content, etc.) |
| `./main`                                              | Types + logic only (no Svelte components)                                                        |
| `./core`                                              | Schema, Validator, Merger, RPath, Path primitives                                                |
| `./theme`                                             | Base theme resolver                                                                              |
| `./lib/*`                                             | Individual utility modules (resolver, snippet, trie, etc.)                                       |
| `./lib/json-schema`                                   | JSON Schema traverse/compare/merge utilities                                                     |
| `./resolvers/*`                                       | Form resolvers (basic, compat)                                                                   |
| `./fields/*`, `./fields/array/*`, `./fields/object/*` | Field components                                                                                 |
| `./fields/extra/*`                                    | Extra field components (file, tags, multi-enum, etc.)                                            |
| `./templates/*`, `./templates/extra/*`                | Template components                                                                              |
| `./validators/*`                                      | Validator utilities (standard-schema, precompile, noop)                                          |
| `./mergers/*`                                         | Merger factories (modern, legacy)                                                                |
| `./id-builders/*`                                     | ID builder factories (modern, legacy)                                                            |
| `./translations/*`                                    | Translation modules (en, ru)                                                                     |
| `./internals`                                         | Symbol keys, FormErrors class (for advanced integrations)                                        |
| `./converters/*`                                      | Schema converters                                                                                |
| `./focus-on-first-error`                              | Focus management utility                                                                         |
| `./omit-extra-data`                                   | Omit extra data utility                                                                          |
| `./options.svelte`                                    | Reactive option mappers                                                                          |
| `./prevent-page-reload.svelte`                        | Prevent page reload utility                                                                      |
