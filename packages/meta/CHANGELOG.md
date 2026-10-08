# meta

## 1.0.11

### Patch Changes

- Fix the playground's precompiled ata validator rejecting `color` and `data-url` values. ([#490](https://github.com/x0k/svelte-jsonschema-form/pull/490))
- Updated dependencies [[`fe8445f`](https://github.com/x0k/svelte-jsonschema-form/commit/fe8445f80999fd8d8599bbee3f59a8285cac3a2c)]:
  - @sjsf/ata-validator@3.9.1
  - @sjsf/ajv8-validator@3.9.1
  - @sjsf/basic-theme@3.9.1
  - @sjsf/cfworker-validator@3.9.1
  - @sjsf/daisyui5-theme@3.9.1
  - @sjsf/flowbite-icons@3.9.1
  - @sjsf/flowbite3-theme@3.9.1
  - @sjsf/form@3.9.1
  - @sjsf/lucide-icons@3.9.1
  - @sjsf/moving-icons@3.9.1
  - @sjsf/radix-icons@3.9.1
  - @sjsf/schemasafe-validator@3.9.1
  - @sjsf/shadcn4-theme@3.9.1
  - @sjsf/skeleton5-theme@3.9.1
  - @sjsf/sveltekit3@3.9.1
  - @sjsf/valibot-validator@3.9.1
  - @sjsf/zod4-validator@3.9.1
  - @sjsf-lab/beercss-theme@3.4.0
  - @sjsf-lab/shadcn-extras-theme@3.4.3
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/skeleton4-theme@3.7.2
  - @sjsf/sveltekit@3.8.2
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2

## 1.0.10

### Patch Changes

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

- Move the workspace to SvelteKit 3. ([#479](https://github.com/x0k/svelte-jsonschema-form/pull/479))

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

- Updated dependencies [[`7180d9c`](https://github.com/x0k/svelte-jsonschema-form/commit/7180d9c546e9ec342489266f4db1bd59bd0dd299), [`4118378`](https://github.com/x0k/svelte-jsonschema-form/commit/41183783b600c2a3de618c35e33c673f7ca5bcbf), [`38b877a`](https://github.com/x0k/svelte-jsonschema-form/commit/38b877ab4ce2eb33f9e1e74729481df902372761), [`e1e4a1b`](https://github.com/x0k/svelte-jsonschema-form/commit/e1e4a1b0a3a865f9e2cda4fa455250da1f63e14f), [`4118378`](https://github.com/x0k/svelte-jsonschema-form/commit/41183783b600c2a3de618c35e33c673f7ca5bcbf), [`df64456`](https://github.com/x0k/svelte-jsonschema-form/commit/df644562fdcf5108055432286e7c3e9794f93906), [`2eecc21`](https://github.com/x0k/svelte-jsonschema-form/commit/2eecc21dc8a8d784e72b51837d56895bccc0b595)]:
  - @sjsf/cfworker-validator@3.9.0
  - @sjsf/form@3.9.0
  - @sjsf/sveltekit3@3.9.0
  - @sjsf-lab/beercss-theme@3.4.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf-lab/shadcn-extras-theme@3.4.3
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/skeleton4-theme@3.7.2
  - @sjsf/sveltekit@3.8.2
  - @sjsf/ajv8-validator@3.9.0
  - @sjsf/ata-validator@3.9.0
  - @sjsf/basic-theme@3.9.0
  - @sjsf/daisyui5-theme@3.9.0
  - @sjsf/flowbite-icons@3.9.0
  - @sjsf/flowbite3-theme@3.9.0
  - @sjsf/lucide-icons@3.9.0
  - @sjsf/moving-icons@3.9.0
  - @sjsf/radix-icons@3.9.0
  - @sjsf/schemasafe-validator@3.9.0
  - @sjsf/shadcn4-theme@3.9.0
  - @sjsf/skeleton5-theme@3.9.0
  - @sjsf/valibot-validator@3.9.0
  - @sjsf/zod4-validator@3.9.0

## 1.0.9

### Patch Changes

- Updated dependencies [[`cbd6a75`](https://github.com/x0k/svelte-jsonschema-form/commit/cbd6a753c1d97fb01ac7d9fa6a63917b9c0a7175), [`5e3fba2`](https://github.com/x0k/svelte-jsonschema-form/commit/5e3fba2b35f4fb8f5aa18aa95c4cbb19524e66ae), [`8576331`](https://github.com/x0k/svelte-jsonschema-form/commit/8576331f650bbbf2a9c7e3025e2d2d10dfd13995), [`75dc88e`](https://github.com/x0k/svelte-jsonschema-form/commit/75dc88e90af30af45375a889cbe97546649620bd), [`73e6a8b`](https://github.com/x0k/svelte-jsonschema-form/commit/73e6a8b84dfbfcb1870146c7ebc2afd7bbd6bb09), [`a2f796d`](https://github.com/x0k/svelte-jsonschema-form/commit/a2f796dde94e8b2f01ddcba004f19a45e391e619), [`8c5acbe`](https://github.com/x0k/svelte-jsonschema-form/commit/8c5acbef9cf9fe1e8d6f26ba5df606bf54ce4359), [`4ea5bc8`](https://github.com/x0k/svelte-jsonschema-form/commit/4ea5bc86b1e1e0037cf01fef6031351de85e36ea), [`4ea5bc8`](https://github.com/x0k/svelte-jsonschema-form/commit/4ea5bc86b1e1e0037cf01fef6031351de85e36ea)]:
  - @sjsf/form@3.8.2
  - @sjsf/valibot-validator@3.8.2
  - @sjsf/zod4-validator@3.8.2
  - @sjsf/shadcn4-theme@3.8.2
  - @sjsf-lab/shadcn-extras-theme@3.4.3
  - @sjsf-lab/beercss-theme@3.4.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/skeleton4-theme@3.7.2
  - @sjsf/ajv8-validator@3.8.2
  - @sjsf/ata-validator@3.8.2
  - @sjsf/basic-theme@3.8.2
  - @sjsf/cfworker-validator@3.8.2
  - @sjsf/daisyui5-theme@3.8.2
  - @sjsf/flowbite-icons@3.8.2
  - @sjsf/flowbite3-theme@3.8.2
  - @sjsf/lucide-icons@3.8.2
  - @sjsf/moving-icons@3.8.2
  - @sjsf/radix-icons@3.8.2
  - @sjsf/schemasafe-validator@3.8.2
  - @sjsf/skeleton5-theme@3.8.2
  - @sjsf/sveltekit@3.8.2

## 1.0.8

### Patch Changes

- Configure SvelteKit via the Vite plugin instead of a separate `svelte.config.js` in sandbox output ([#440](https://github.com/x0k/svelte-jsonschema-form/pull/440))

## 1.0.7

### Patch Changes

- Updated dependencies [[`78936f0`](https://github.com/x0k/svelte-jsonschema-form/commit/78936f087157eac69c5e52225614bc273d45ac3c), [`7c27d1e`](https://github.com/x0k/svelte-jsonschema-form/commit/7c27d1ea3a9601ffdefb70096c2d2ad0d121f02d), [`d11f390`](https://github.com/x0k/svelte-jsonschema-form/commit/d11f39039489c6c8632d34cff4b2cf1f02ca6a11), [`78f6a88`](https://github.com/x0k/svelte-jsonschema-form/commit/78f6a880971ec28f0dff3167e4b2e3e57bb9368e)]:
  - @sjsf/skeleton5-theme@3.8.0
  - @sjsf/ata-validator@3.8.0
  - @sjsf/form@3.8.0
  - @sjsf-lab/beercss-theme@3.3.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf-lab/shadcn-extras-theme@3.4.2
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/skeleton4-theme@3.7.2
  - @sjsf/ajv8-validator@3.8.0
  - @sjsf/basic-theme@3.8.0
  - @sjsf/cfworker-validator@3.8.0
  - @sjsf/daisyui5-theme@3.8.0
  - @sjsf/flowbite-icons@3.8.0
  - @sjsf/flowbite3-theme@3.8.0
  - @sjsf/lucide-icons@3.8.0
  - @sjsf/moving-icons@3.8.0
  - @sjsf/radix-icons@3.8.0
  - @sjsf/schemasafe-validator@3.8.0
  - @sjsf/shadcn4-theme@3.8.0
  - @sjsf/sveltekit@3.8.0
  - @sjsf/valibot-validator@3.8.0
  - @sjsf/zod4-validator@3.8.0

## 1.0.6

### Patch Changes

- Updated dependencies [[`e30f1ee`](https://github.com/x0k/svelte-jsonschema-form/commit/e30f1ee5d3702cde5ead268485351dc1f5a2f447)]:
  - @sjsf/ajv8-validator@3.7.2
  - @sjsf/basic-theme@3.7.2
  - @sjsf/cfworker-validator@3.7.2
  - @sjsf/daisyui5-theme@3.7.2
  - @sjsf/flowbite3-theme@3.7.2
  - @sjsf/flowbite-icons@3.7.2
  - @sjsf/form@3.7.2
  - @sjsf/lucide-icons@3.7.2
  - @sjsf/moving-icons@3.7.2
  - @sjsf/radix-icons@3.7.2
  - @sjsf/schemasafe-validator@3.7.2
  - @sjsf/shadcn4-theme@3.7.2
  - @sjsf/skeleton4-theme@3.7.2
  - @sjsf/sveltekit@3.7.2
  - @sjsf/valibot-validator@3.7.2
  - @sjsf/zod4-validator@3.7.2
  - @sjsf-lab/beercss-theme@3.3.0
  - @sjsf-lab/shadcn-extras-theme@3.4.2
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf-lab/ata-validator@3.2.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2

## 1.0.5

### Patch Changes

- Updated dependencies [[`1e90ecc`](https://github.com/x0k/svelte-jsonschema-form/commit/1e90ecc284ab5894ab861148e0f1d351eaddb655)]:
  - @sjsf/sveltekit@3.7.1
  - @sjsf/ajv8-validator@3.7.1
  - @sjsf/basic-theme@3.7.1
  - @sjsf/daisyui5-theme@3.7.1
  - @sjsf/flowbite-icons@3.7.1
  - @sjsf/flowbite3-theme@3.7.1
  - @sjsf/form@3.7.1
  - @sjsf/moving-icons@3.7.1
  - @sjsf/schemasafe-validator@3.7.1
  - @sjsf/shadcn4-theme@3.7.1
  - @sjsf/valibot-validator@3.7.1
  - @sjsf/zod4-validator@3.7.1
  - @sjsf/skeleton4-theme@3.7.1
  - @sjsf/cfworker-validator@3.7.1
  - @sjsf/lucide-icons@3.7.1
  - @sjsf/radix-icons@3.7.1
  - @sjsf-lab/beercss-theme@3.3.0
  - @sjsf-lab/shadcn-extras-theme@3.4.2
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf-lab/ata-validator@3.2.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.2

## 1.0.4

### Patch Changes

- Updated dependencies [[`05c548f`](https://github.com/x0k/svelte-jsonschema-form/commit/05c548f2bc2d89867e87479150af1c7289cd7474), [`c9c91dc`](https://github.com/x0k/svelte-jsonschema-form/commit/c9c91dc46081883bd468282bbe09584178bc5d4f), [`d4e6e8d`](https://github.com/x0k/svelte-jsonschema-form/commit/d4e6e8d592307d367489005d79fb97aa2af764c0), [`2018c3a`](https://github.com/x0k/svelte-jsonschema-form/commit/2018c3a03ed757c57d713bbbb0278324c24878d2), [`3ba0ae7`](https://github.com/x0k/svelte-jsonschema-form/commit/3ba0ae7aab68632ed91fe4b5806af8efeddf2603), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`c3d44c0`](https://github.com/x0k/svelte-jsonschema-form/commit/c3d44c0822b997ca579aaa01e2f1682100e2b400), [`fd3b45b`](https://github.com/x0k/svelte-jsonschema-form/commit/fd3b45b5fe933eaa787f293ea6f8fd5a5849844b), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`d4e6e8d`](https://github.com/x0k/svelte-jsonschema-form/commit/d4e6e8d592307d367489005d79fb97aa2af764c0), [`202f9b6`](https://github.com/x0k/svelte-jsonschema-form/commit/202f9b64e997efa5446eef27a49686c727b9898a), [`0e3415e`](https://github.com/x0k/svelte-jsonschema-form/commit/0e3415ed8da63eb11f768aeb0fa6811b8a3d7708), [`4cfe8af`](https://github.com/x0k/svelte-jsonschema-form/commit/4cfe8af2eb314902f8942a7494d91c28cf76d02b), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`674d4aa`](https://github.com/x0k/svelte-jsonschema-form/commit/674d4aaa09c71020b83b04e5c8bee654caa783be), [`d4e6e8d`](https://github.com/x0k/svelte-jsonschema-form/commit/d4e6e8d592307d367489005d79fb97aa2af764c0), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`d4e6e8d`](https://github.com/x0k/svelte-jsonschema-form/commit/d4e6e8d592307d367489005d79fb97aa2af764c0), [`2018c3a`](https://github.com/x0k/svelte-jsonschema-form/commit/2018c3a03ed757c57d713bbbb0278324c24878d2), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`bc30239`](https://github.com/x0k/svelte-jsonschema-form/commit/bc302395e8d3589d3681d9c0de2ea36eeacf56db), [`d4e6e8d`](https://github.com/x0k/svelte-jsonschema-form/commit/d4e6e8d592307d367489005d79fb97aa2af764c0), [`2a9490c`](https://github.com/x0k/svelte-jsonschema-form/commit/2a9490cc0e9f73f1023c1a88129b909b7ffed35f), [`2018c3a`](https://github.com/x0k/svelte-jsonschema-form/commit/2018c3a03ed757c57d713bbbb0278324c24878d2), [`674d4aa`](https://github.com/x0k/svelte-jsonschema-form/commit/674d4aaa09c71020b83b04e5c8bee654caa783be), [`0fe38d2`](https://github.com/x0k/svelte-jsonschema-form/commit/0fe38d2dc0b0d3f0242fbbbafb764ae43557be3d), [`2018c3a`](https://github.com/x0k/svelte-jsonschema-form/commit/2018c3a03ed757c57d713bbbb0278324c24878d2)]:
  - @sjsf/form@3.7.0
  - @sjsf/daisyui5-theme@3.7.0
  - @sjsf/shadcn4-theme@3.7.0
  - @sjsf-lab/ata-validator@3.2.0
  - @sjsf-lab/hyperjump-validator@3.1.0
  - @sjsf/ajv8-validator@3.7.0
  - @sjsf/valibot-validator@3.7.0
  - @sjsf/shadcn-theme@3.1.2
  - @sjsf-lab/shadcn-extras-theme@3.4.2
  - @sjsf/zod4-validator@3.7.0
  - @sjsf/sveltekit@3.7.0
  - @sjsf-lab/beercss-theme@3.3.0
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/basic-theme@3.7.0
  - @sjsf/cfworker-validator@3.7.0
  - @sjsf/flowbite-icons@3.7.0
  - @sjsf/flowbite3-theme@3.7.0
  - @sjsf/lucide-icons@3.7.0
  - @sjsf/moving-icons@3.7.0
  - @sjsf/radix-icons@3.7.0
  - @sjsf/schemasafe-validator@3.7.0
  - @sjsf/skeleton4-theme@3.7.0

## 1.0.3

### Patch Changes

- Updated dependencies [[`8955fa5`](https://github.com/x0k/svelte-jsonschema-form/commit/8955fa51295ffd332012008683967e68a2c7051e)]:
  - @sjsf-lab/ata-validator@3.1.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`639a816`](https://github.com/x0k/svelte-jsonschema-form/commit/639a816861c1d6082de8e56145d0e8298aac9872), [`639a816`](https://github.com/x0k/svelte-jsonschema-form/commit/639a816861c1d6082de8e56145d0e8298aac9872)]:
  - @sjsf-lab/ata-validator@3.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`387f572`](https://github.com/x0k/svelte-jsonschema-form/commit/387f572cde0bec9e6403b1caee63f42e06baab7c), [`c437f1e`](https://github.com/x0k/svelte-jsonschema-form/commit/c437f1e6a414d3be46ceda65193856bd205fcf39), [`b926817`](https://github.com/x0k/svelte-jsonschema-form/commit/b926817ac7984364b0f7ab61fc7d21233a9786e3), [`6329bda`](https://github.com/x0k/svelte-jsonschema-form/commit/6329bda88759c276ec4abc22535aaaac2ea5694d), [`7ad3034`](https://github.com/x0k/svelte-jsonschema-form/commit/7ad30345506ac99e0597e661a1ed41398c3c67d4), [`d6ae3ee`](https://github.com/x0k/svelte-jsonschema-form/commit/d6ae3ee41dcb09fa9b2e2524cd8b2d9710dc532c), [`4e0e296`](https://github.com/x0k/svelte-jsonschema-form/commit/4e0e296418758be217e77f0abd5e7cebbc125930), [`57ecfa6`](https://github.com/x0k/svelte-jsonschema-form/commit/57ecfa66515b33b43f2cf63c24c5d4a1e4f02054), [`1399898`](https://github.com/x0k/svelte-jsonschema-form/commit/1399898032240a02b9b1d75f1dbff5a341ed99db), [`f5a156d`](https://github.com/x0k/svelte-jsonschema-form/commit/f5a156df0a5a74814f719cd3e2b4594459c90ff7), [`0b2bb7c`](https://github.com/x0k/svelte-jsonschema-form/commit/0b2bb7cfcfd7f5e118777e2b407c9a960c29366d)]:
  - @sjsf/form@3.6.0
  - @sjsf-lab/hyperjump-validator@3.0.0
  - @sjsf-lab/shadcn-extras-theme@3.4.1
  - @sjsf/ajv8-validator@3.6.0
  - @sjsf-lab/ata-validator@3.0.0
  - @sjsf-lab/beercss-theme@3.3.0
  - @sjsf-lab/svar-theme@3.3.0
  - @sjsf/daisyui-theme@3.1.1
  - @sjsf/flowbite-theme@3.1.1
  - @sjsf/shadcn-theme@3.1.1
  - @sjsf/skeleton3-theme@3.1.1
  - @sjsf/basic-theme@3.6.0
  - @sjsf/cfworker-validator@3.6.0
  - @sjsf/daisyui5-theme@3.6.0
  - @sjsf/flowbite-icons@3.6.0
  - @sjsf/flowbite3-theme@3.6.0
  - @sjsf/lucide-icons@3.6.0
  - @sjsf/moving-icons@3.6.0
  - @sjsf/radix-icons@3.6.0
  - @sjsf/schemasafe-validator@3.6.0
  - @sjsf/shadcn4-theme@3.6.0
  - @sjsf/skeleton4-theme@3.6.0
  - @sjsf/sveltekit@3.6.0
  - @sjsf/valibot-validator@3.6.0
  - @sjsf/zod4-validator@3.6.0
