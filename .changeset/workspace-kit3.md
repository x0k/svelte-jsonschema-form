---
"meta": patch
---

Move the workspace to SvelteKit 3.

`@sveltejs/kit` `^3.0.0` is now the default catalog, so every package that ran
`svelte-kit sync` against the hoisted Kit 2 — the themes, the validators, the
icon packs — now typechecks against Kit 3. The 29 of them that never declared
the dependency (and so inherited both the module and the `svelte-kit` CLI bin
through hoisting) now declare it, which is what makes the version bump reach
their tooling at all.

Following [the Kit 3 migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3):

- `svelte.config.js` is gone; `kit.*` options moved into the `sveltekit()` Vite
  plugin. The deprecated `kit.alias` was an unused shadcn template placeholder
  pointing at `./path/to/lib/*`, so it is dropped rather than moved.
- `$lib` became `#lib` subpath imports, with an `imports` map per package and
  the extensions Kit 3 requires on them.
- `tsconfig.json` extends `$app/tsconfig` and now declares `include`/`exclude`
  itself — `$app/tsconfig` supplies `compilerOptions` only, so dropping it
  silently widened every project to `build/` and `dist/`.
- `$app/environment` became `$app/env`.
- `adapter-auto` `^8` and `adapter-static` `^4`, the releases that peer Kit 3.
  `adapter-auto@7` was also being emitted into Kit 3 projects by the composer.

`legacy/sveltekit`, the legacy themes and `examples/sveltekit-starter` stay on
Kit 2 via a new `kit2` catalog: `@sjsf/sveltekit` peers `^2.48.3`. They reach
`src/lib` through the same `#lib` subpath imports as everything else — Kit 2
resolves those too, since `package.json#imports` is Node's, not Kit's. The nine
demos that copy from `examples/sveltekit-starter` pin `kitRange` per example
rather than through `COMPOSER_DEFAULTS`, so the rest get the Kit 3 output their
migrated example sources need.
