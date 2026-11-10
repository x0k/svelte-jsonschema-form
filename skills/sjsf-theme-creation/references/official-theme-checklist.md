# Official Theme Checklist

This checklist applies only to themes shipped from this repository. A
third-party theme needs a working `theme` export and the required components
and widgets described in `SKILL.md`; it does **not** need include modules,
`./specs`, `theme-testing`, docs, meta registration, or a changeset.

Use this checklist when adding or promoting an official theme.

## 1. Package Location and Metadata

- Put maintained themes in `packages/<name>-theme`. Use `lab/` for
  experimental themes and `legacy/` for themes pinned to an older UI library
  version. The workspace globs already include all three directories.
- Name the package `@sjsf/<name>-theme` (`@sjsf-lab/<name>-theme` in `lab/`).
- New themes keep sources under `src/lib` (older themes such as
  `basic-theme` use `src`). Use the `#lib` import alias when the package needs
  internal absolute imports.
- Add a package `README.md` with installation and usage, plus the repository
  `LICENSE` terms (MIT).

`package.json` must include:

```json
{
  "name": "@sjsf/<name>-theme",
  "version": "<current fixed-group version>",
  "description": "The <framework> based theme for svelte-jsonschema-form",
  "keywords": ["form", "<framework>", "theme"],
  "homepage": "https://x0k.github.io/svelte-jsonschema-form/",
  "bugs": "https://github.com/x0k/svelte-jsonschema-form/issues",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/x0k/svelte-jsonschema-form.git",
    "directory": "packages/<name>-theme"
  },
  "files": ["dist", "!dist/**/*.test.*", "!dist/**/*.spec.*"],
  "type": "module",
  "types": "./dist/index.d.ts",
  "svelte": "./dist/index.js",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    },
    "./components/*": {
      "types": "./dist/components/*.d.ts",
      "svelte": "./dist/components/*"
    },
    "./widgets/*": {
      "types": "./dist/widgets/*.d.ts",
      "svelte": "./dist/widgets/*"
    },
    "./extra-widgets/*": {
      "types": "./dist/extra-widgets/*.d.ts",
      "svelte": "./dist/extra-widgets/*"
    },
    "./styles.css": "./dist/styles.css",
    "./specs": {
      "types": "./dist/specs.d.ts",
      "svelte": "./dist/specs.js"
    }
  },
  "publishConfig": {
    "provenance": true
  },
  "scripts": {
    "build": "svelte-package && publint",
    "test": "vitest run --exclude '.svelte-kit/**'",
    "check": "svelte-check --tsconfig ./tsconfig.json --tsgo-experimental-api",
    "lint": "eslint .",
    "format": "oxfmt .",
    "format:check": "oxfmt --check ."
  },
  "devDependencies": {
    "@sjsf/ajv8-validator": "workspace:*",
    "@sjsf/form": "workspace:*",
    "svelte": "catalog:",
    "theme-testing": "workspace:*"
  },
  "peerDependencies": {
    "@sjsf/form": "workspace:^3.5.0",
    "svelte": "^5.34.8"
  }
}
```

Adjust the exports for the styling strategy:

- Static CSS files use `"./css/*.css": "./dist/css/*.css"` and are imported as
  `<package>/css/<file>.css`.
- Tailwind v4 themes usually publish an extracted `"./styles.css"` instead.
- Keep `"./extra-widgets/*"`.
- Add `"./specs"` and the include modules described below.

Use the current version of the fixed release group (see the other official
themes); do not invent a version. The `@sjsf/form` and `svelte` peer ranges
match `packages/basic-theme`; keep them aligned with the other official themes.
Add framework-specific peer dependencies and `peerDependenciesMeta` entries
when they are optional.

## 2. Required Exports

An official theme exports:

- `theme` from the package root.
- `specs` and `extraWidgets` from `<package>/specs`.
- One `<widget>-include.ts` module for every extra widget.

The theme entry point is the same resolver composition shown in `SKILL.md`:

```ts
// src/lib/index.ts
import { extendByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import { definitions } from "./definitions.js";

export const theme = extendByRecord(base, definitions);
```

`definitions.ts` is only needed because include modules mutate the shared
registry used by `theme`; see section 3. A theme without include modules can
inline its component/widget map in `index.ts`.

Official themes also follow the UI option naming rules in `SKILL.md` Step 3:
reuse basic theme keys for equivalent components and prefix framework-specific
options with the theme name.

`specs.ts` imports every theme include module and any core extra field includes
used by its specs:

```ts
import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/rating-include.js";
import "./extra-widgets/textarea-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
  rating: [
    s.number,
    {
      "ui:components": {
        numberWidget: "ratingWidget",
      },
    },
    {
      oninput: "inputRating",
      onchange: "changeRating",
      onblur: "visitRating",
    },
  ],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
```

`16` is the length of `./extra-widgets/` and `7` is the length of `.svelte`.
Adjust both numbers if the widgets live in a nested directory, as in
`./theme/extra-widgets/`.

The docs consume the glob result to generate the `-include` import list, and
`extract-widgets` independently discovers the same files from the package
export. Keep the glob path and the export path in sync.

## 3. Extra Widget Include Modules

Each extra widget is a pair:

```text
src/lib/extra-widgets/
  rating.svelte
  rating-include.ts
```

The include module mutates the shared `definitions` object and augments the
theme-local `ExtraWidgets` interface:

```ts
// src/lib/extra-widgets/rating-include.ts
import { definitions } from "../definitions.js";
import Rating from "./rating.svelte";
import "./rating.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    ratingWidget: {};
  }
}

definitions.ratingWidget = Rating;
```

Rules:

- Do not create a new object or clone `definitions`; the include module must
  mutate the same object used to build `theme`.
- Keep the `import "./rating.svelte"` side-effect import to match existing
  official include modules.
- Consumers import the include module for its side effects:
  `<package>/extra-widgets/rating-include`.
- The widget component must use `ComponentProps["ratingWidget"]` (and the
  corresponding `@sjsf/form/fields/extra-widgets/...` type module) so
  `extract-widgets` can detect its type name.
- The package `./extra-widgets/*` export must cover both the `.svelte` file and
  the `-include` module.

If an extra widget needs a core field type (for example a tags or aggregated
field), import the matching `@sjsf/form/fields/extra/*-include` module in
`specs.ts` as well.

## 4. Tests

Official themes run the shared browser and SSR contract suites:

```ts
// tests/fields.svelte.test.ts
import { fieldTests } from "theme-testing/tests";

import { theme } from "../src/lib/index.js";
import { specs } from "../src/lib/specs.js";
import Form from "./form.svelte";

fieldTests(theme, { specs, Form });
```

```ts
// tests/fields.ssr.test.ts
import { fieldSsrTests } from "theme-testing/tests/ssr";

import { theme } from "../src/lib/index.js";

fieldSsrTests(theme);
```

`tests/form.svelte` is the browser test host:

```svelte
<script lang="ts">
  import { BasicForm, createForm, type FormOptions } from "@sjsf/form";

  import "../src/lib/extra-widgets/checkboxes-include.js";

  import "../src/app.css";

  const props: FormOptions<any> = $props();
  const form = createForm(props);
</script>

<BasicForm {form} />
```

Point the CSS import at the theme's stylesheet entry point. If the theme needs
a context or wrapper (for example a component registry), pass `context` to
`fieldTests`/`fieldSsrTests` and wrap the form in `tests/form.svelte`. See
`packages/shadcn4-theme/tests` for that pattern.

Add a visual regression test (`tests/visual.svelte.vrt.test.ts`) when the theme
has meaningful visual behavior. Update snapshots deliberately and review the
diff before committing. `theme-testing` is private and must stay a
`devDependency`; never import it from published runtime code.

## 5. Docs Page and Demo

Add `apps/docs2/src/content/docs/themes/<name>.mdx`:

```mdx
---
title: "<Framework>"
type: package
packageCodeName: "<name>"
sidebar:
  order: 10
---

import { Code, TabItem, Tabs } from "@astrojs/starlight/components";
import { specs, extraWidgets } from "@sjsf/<name>-theme/specs";
import styles from "@sjsf/<name>-theme/styles.css?inline";
import { themePackage } from "meta";

import { getPackageDependencies } from "@/shared";
import Npm from "@/components/npm.astro";
import Deps from "@/components/peer-dependencies.astro";
import FormCard from "@/components/form-card.astro";

import Form from "./<name>/form.svelte";
import uiOptionsCode from "./<name>/ui-options?raw";
import {
  createExtraImports,
  createSchemas,
  replacer,
  validationEvents,
} from "./_demo-schema";

export const schemas = createSchemas(specs);
export const pkg = themePackage("<name>");

## Installation

<Npm pkg={getPackageDependencies(pkg)} />

<Deps pkg={pkg} />

## Extra widgets

<Code lang="ts" code={createExtraImports("<name>", extraWidgets)} />

## Widgets demo

<Tabs>
  <TabItem label="Form">
    <FormCard style={styles}>
      <Form client:only="svelte" />
    </FormCard>
  </TabItem>
  <TabItem label="JSON Schema">
    <Code lang="json" code={JSON.stringify(schemas.schema, replacer, 2)} />
  </TabItem>
  <TabItem label="UI Schema">
    <Code lang="json" code={JSON.stringify(schemas.uiSchema, replacer, 2)} />
  </TabItem>
</Tabs>

## Supported validation events

<div set:html={validationEvents(specs)}></div>

## UI options

<Code code={uiOptionsCode} lang="typescript" />
```

Also add:

- `apps/docs2/src/content/docs/themes/<name>/form.svelte` — the live demo.
- `apps/docs2/src/content/docs/themes/<name>/ui-options.ts` — a copy of the
  public `UiOptions` surface.
- The theme package to `apps/docs2/package.json` dependencies.

The docs sidebar is generated from the `themes` directory, so no manual
sidebar entry is needed. Use `styles` only for extracted CSS themes; static CSS
themes follow the `basic.mdx` pattern with `PLAYGROUND_SJSF_THEME_STYLES`.

## 6. Meta Registration

`packages/meta` drives the docs, playground, and package metadata.

1. Add a JSON import for the theme package in
   `packages/meta/src/themes.ts`
   (`import _namePackageJson from "@sjsf/<name>-theme/package.json" with { type: "json" };`).
2. Add the theme key to `THEMES`.
3. Fill in `THEME_OR_SUB_THEME_TITLES`, `THEME_BRAND`, and `THEME_PACKAGES`.
   The `satisfies Record<Theme, ...>` annotations make missing entries a type
   error.
4. If the theme is experimental or legacy, add it to `LAB_THEMES` or
   `LEGACY_THEMES`.
5. If it uses Tailwind v4, add it to `TAILWINDCSS4_THEMES` and
   `TAILWINDCSS4_THEME_PLUGINS`.
6. If it extends another theme, add it to `THEME_EXTENSION` and
   `THEME_EXTENSION_ORIGINS`.
7. Add CSS at-rules in `THEME_OR_SUB_THEME_AT_RULES` when the generated
   playground must import the theme stylesheet or add a Tailwind `@source`.
8. For non-legacy themes, register the generated theme in
   `packages/meta/src/playground/themes.ts` (`PLAYGROUND_SJSF_THEMES`) and add
   a `THEME_CSS_SOURCES` entry in
   `packages/meta/scripts/extract-theme-styles.ts` so the playground CSS can be
   extracted.
9. Add the package to `packages/meta/package.json` dependencies (and to
   `apps/docs2/package.json` as described above).

Then regenerate metadata:

```bash
pnpm --filter meta extract-metadata
```

This regenerates `packages/meta/src/widgets.generated.ts`,
`packages.generated.ts`, `playground/themes.generated.ts`, and related files.
Do not hand-edit generated files. `pnpm --filter meta check` runs extraction
before type checking, so a stale generated file will fail the check.

`extract-widgets` expects the package `./widgets/*` and `./extra-widgets/*`
exports to point at `./dist/.../*`, and it derives each widget type from the
first `ComponentProps[...]` occurrence in the `.svelte` source. Do not place
another `ComponentProps[...]` reference before the widget props.

## 7. Example Starter

Official themes normally ship an `examples/<name>-starter`:

- Private SvelteKit package with the theme, `@sjsf/form`, a validator, and
  `svelte` as dependencies.
- `src/lib/sjsf/defaults.ts` re-exports the theme (and any required includes).
- `src/routes/+layout.svelte` imports the theme CSS or configures the Tailwind
  source path.
- A minimal route creates a form with the theme.

The workspace glob includes `examples/*`, so no workspace edit is required.
Use an existing starter with the same styling strategy as a template.

## 8. Changeset

If the theme is released with the main packages:

1. Add the package to the `fixed` group in `.changeset/config.json`.
2. Run `pnpm changeset`.
3. Select the new theme and any affected released packages.
4. Describe the new theme and its required peer dependencies.

If the theme is experimental (`lab/`) or not part of the released group, follow
the existing policy for that directory instead of adding it to the fixed group.

## 9. Verification

Run from the repository root:

```bash
pnpm install
pnpm --filter @sjsf/<name>-theme build
pnpm --filter @sjsf/<name>-theme check
pnpm --filter @sjsf/<name>-theme test
pnpm --filter meta extract-metadata
pnpm --filter meta check
pnpm --filter docs2 check
pnpm exec oxfmt <changed files>
```

For themes with extracted CSS, the build must also:

1. Build the demo stylesheet with Vite.
2. Move the generated `_page*.css` to `dist/styles.css`.
3. Replace `:root` with `:host` (or otherwise guarantee `:host`).
4. Run `../../scripts/validate-theme-css.sh`.
5. Run `publint`.

Finally, inspect `git diff` and confirm that generated metadata and snapshots
contain only the expected changes.
