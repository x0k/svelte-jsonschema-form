---
"@sjsf/sv": minor
"meta": patch
---

Generate the integration package that matches the target project's `@sveltejs/kit`
range: `@sjsf/sveltekit` for Kit 2, `@sjsf/sveltekit3` for Kit 3. Since `sv@1`
templates all scaffold Kit 3, `sv add @sjsf` no longer installs a Kit 2 package
into a Kit 3 app.

The composer's Kit 3 output also gains the shape that `sv create` provides for
its templates: `tsconfig.json` extends `$app/tsconfig` instead of the removed
`.svelte-kit/tsconfig.json`, and `package.json` gains the `#lib` subpath imports.

`#lib` specifiers now carry a file extension. Unlike `$lib`, which Kit 2 resolves
through `tsconfig` `paths`, `#lib` is a `package.json#imports` subpath and has to
be unambiguous for Node and TypeScript to resolve it.
