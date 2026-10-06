# @sjsf/sv

## 0.3.0

### Minor Changes

- Generate the integration package that matches the target project's `@sveltejs/kit` ([#479](https://github.com/x0k/svelte-jsonschema-form/pull/479))
  range: `@sjsf/sveltekit` for Kit 2, `@sjsf/sveltekit3` for Kit 3. Since `sv@1`
  templates all scaffold Kit 3, `sv add @sjsf` no longer installs a Kit 2 package
  into a Kit 3 app.

  The composer's Kit 3 output also gains the shape that `sv create` provides for
  its templates: `tsconfig.json` extends `$app/tsconfig` instead of the removed
  `.svelte-kit/tsconfig.json`, and `package.json` gains the `#lib` subpath imports.

  `#lib` specifiers now carry a file extension. Unlike `$lib`, which Kit 2 resolves
  through `tsconfig` `paths`, `#lib` is a `package.json#imports` subpath and has to
  be unambiguous for Node and TypeScript to resolve it.

- Require `sv@^1` and migrate to the published `@sveltejs/sv-utils@^1`, importing ([#479](https://github.com/x0k/svelte-jsonschema-form/pull/479))
  `transforms` from its `browser` entry so codegen stays off the Node-only one.

  Generated files are now formatted by the `@sveltejs/sv-utils@1` printer, which
  reorders imports, parenthesizes `as const` expressions and rewraps long lines.

### Patch Changes

- List the demo route in the floating `DemoLinks` post-it that `sv` renders from the ([#483](https://github.com/x0k/svelte-jsonschema-form/pull/483))
  root layout, instead of linking it from a `/demo` index page.

  Uses `defineDemoPage` from `@sveltejs/sv-utils@^1.0.1`, so both transforms are
  idempotent and re-running the add-on no longer duplicates the link. The
  `meta/codegen` `addToDemoPage` helper, a copy of the removed `sv` one, is gone.

## 0.2.6

### Patch Changes

- Add SvelteKit 3 support: `createKitPathFactory` generates `#lib` imports when `@sveltejs/kit@^3` is detected ([#440](https://github.com/x0k/svelte-jsonschema-form/pull/440))

## 0.2.5

### Patch Changes

- Remove "experimental" label from `ata-validator` ([#435](https://github.com/x0k/svelte-jsonschema-form/pull/435))

## 0.2.4

### Patch Changes

- Add missing `json-schema-to-ts` dependency for the `noop` validator type ([#430](https://github.com/x0k/svelte-jsonschema-form/pull/430))

## 0.2.3

### Patch Changes

- Add npm provenance support ([`8b67594`](https://github.com/x0k/svelte-jsonschema-form/commit/8b67594d1285e4439bc440dc289ca9815116f523))

## 0.2.2

### Patch Changes

- Fix remote function integration page generation ([#416](https://github.com/x0k/svelte-jsonschema-form/pull/416))

- Fix addon options definition ([#416](https://github.com/x0k/svelte-jsonschema-form/pull/416))

## 0.2.1

### Patch Changes

- Update precompiled validators usage ([#386](https://github.com/x0k/svelte-jsonschema-form/pull/386))

- Remove workaround for `@tailwindcss/vite@4.2.4` ([#388](https://github.com/x0k/svelte-jsonschema-form/pull/388))

## 0.2.0

### Minor Changes

- Add an option to disable demo ([#380](https://github.com/x0k/svelte-jsonschema-form/pull/380))

### Patch Changes

- Remove workarounds for fixed issues ([#380](https://github.com/x0k/svelte-jsonschema-form/pull/380))

## 0.1.0

### Minor Changes

- Add `@sjsf/sv` package ([#356](https://github.com/x0k/svelte-jsonschema-form/pull/356))
