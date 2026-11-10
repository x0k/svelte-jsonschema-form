---
name: sjsf-theme-creation
description: Create themes for svelte-jsonschema-form (v3). Use when building a reusable SJSF theme package, implementing required form components and widgets with Svelte 5 runes, composing a resolver with extendByRecord/overrideByRecord, adding extra widgets, or making a theme official in this monorepo (include modules, specs export, theme-testing, docs, meta).
---

# SJSF Theme Creation

A theme is a resolver (`Theme` from `@sjsf/form`) that maps SJSF component
types to Svelte 5 components. Conceptually it behaves like
`(type, config) => component | undefined`.

`@sjsf/form/theme` exports `base`, which already supplies all field components
and templates. A theme package supplies the visual layer: generic components,
widgets, and optionally template or field overrides.

If you only need to replace a few components in one app, use
[`sjsf-custom-components`](../sjsf-custom-components/SKILL.md) instead of
publishing a theme.

## Step 1: Scaffold the Theme Package

Use this layout (new monorepo themes use `src/lib`; older ones may use `src`):

```text
src/lib/
  components/
    exports.ts
    form.svelte
    submit-button.svelte
    button.svelte
    layout.svelte
    title.svelte
    label.svelte
    description.svelte
    help.svelte
    errors-list.svelte
  widgets/
    exports.ts
    text.svelte
    number.svelte
    select.svelte
    checkbox.svelte
  extra-widgets/
    rating.svelte
  index.ts
```

Recommended `package.json` surface:

```json
{
  "name": "@acme/sjsf-theme",
  "version": "0.1.0",
  "type": "module",
  "types": "./dist/index.d.ts",
  "svelte": "./dist/index.js",
  "files": ["dist", "!dist/**/*.test.*", "!dist/**/*.spec.*"],
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
    "./css/*.css": "./dist/css/*.css"
  },
  "peerDependencies": {
    "@sjsf/form": "^3.5.0",
    "svelte": "^5.34.8"
  }
}
```

The peer ranges mirror `packages/basic-theme/package.json`. Build Svelte
packages with `svelte-package && publint` (use `svelte-package --input src`
when sources live directly in `src` instead of `src/lib`).

## Step 2: Implement the Required Surface

Every theme must provide these component types:

| Kind               | Types                                                                                             |
| :----------------- | :------------------------------------------------------------------------------------------------ |
| Generic components | `form`, `submitButton`, `button`, `layout`, `title`, `label`, `description`, `help`, `errorsList` |
| Widgets            | `textWidget`, `numberWidget`, `selectWidget`, `checkboxWidget`                                    |

`base` supplies all templates and fields. Override them only when the UI
framework needs a different structure or a framework-specific field component
(for example `enumField`, `multiEnumField`, `aggregatedField`, `fileField`).

Type every component with the `ComponentProps` registry and use the form-state
attribute helpers. A complete contract table and full component examples are in
[Theme Contract](references/theme-contract.md).

### Form component

```svelte
<script lang="ts" module>
  import type { HTMLFormAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      form?: HTMLFormAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    formAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    children,
    ref = $bindable(),
    config,
    attributes,
  }: ComponentProps["form"] = $props();

  const ctx = getFormContext();
</script>

<form
  bind:this={ref}
  onsubmit={ctx.submit}
  onreset={ctx.reset}
  {...formAttributes(ctx, config, "form", attributes, {
    class: "my-form",
  })}
>
  {@render children()}
</form>
```

### Text widget

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      text?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "text", handlers, {
      type: "text",
      class: "my-text",
    })
  );
</script>

<input bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
```

Key rules:

1. **Spread the attributes** returned by `inputAttributes`,
   `selectAttributes`, `textareaAttributes`, `formAttributes`,
   `buttonAttributes`, and the layout/title/label helpers. They include ids,
   aria attributes, disabled state, and UI option overrides. The input helpers
   also install the symbol-keyed `handlers` attachment.
2. **Do not call `handlers` manually** when spreading onto a native element.
   Only map or invoke them when wrapping a third-party component that drops
   Svelte attachments.
3. **Map nullable values explicitly.** Number inputs use
   `bind:value={() => value ?? null, (v) => (value = v ?? undefined)}`;
   checkboxes use `bind:checked={() => value ?? false, (v) => (value = v)}`.
4. **Select widgets use the enum mapper helpers** from
   `@sjsf/form/options.svelte` (`singleOption`, `idMapper`, `EMPTY_VALUE`) so
   enum values survive mapping and clearing.
5. **Add UI options via module augmentation** (`interface UiOptions`) and read
   them through the attribute helpers or `retrieveUiOption`.

## Step 3: Configure UI Options

`UiOptions` is the global interface used by `ui:options` and
`ui:globalOptions`. `@sjsf/form` and its field modules already define core
options such as `title`, `description`, `help`, `clearable`, `enumNames`,
`order`, `addable`, and `validationMode`. A theme augments the same interface
for component-specific options.

### Declare an option

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /** Attributes for the text input. */
      text?: HTMLInputAttributes;
    }
  }
</script>
```

Put the augmentation in the component's module script or in a shared
`ui-options.ts` that is imported from the package entry point. A declaration in
a file that consumers never import does not affect their `UiOptions`.

### Read an option

| Option shape                  | How to read it                                                                                                       |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| Object merged into props      | Pass the key to an attribute helper: `inputAttributes(ctx, config, "text", handlers, defaults)`                      |
| Single value                  | `retrieveUiOption(ctx, config, "myOption")`                                                                          |
| Nested value selected by type | `uiOptionNestedProps("buttons", (b) => b[type])` or `retrieveNestedUiOption(ctx, config, "buttons", (b) => b[type])` |
| Field or widget reader        | `uiOption("myOption")` from `ComponentProps["..."]`                                                                  |

Attribute helpers already merge, in order, your defaults, `ui:options`,
`ui:globalOptions`, and `extraUiOptions`. Do not read those options again.
`extraUiOptions` (passed to `createForm`) takes precedence and is intended for
non-serializable values such as functions or component registries.

### Choose an option name

Reuse the basic theme's names when your component has the same meaning and
value type. This keeps UI schemas portable between themes:

| Component type   | Option key               |
| :--------------- | :----------------------- |
| `form`           | `form`                   |
| `submitButton`   | `submitButton`           |
| `button`         | `button`, plus `buttons` |
| `layout`         | `layout`, plus `layouts` |
| `title`          | `titleAttributes`        |
| `label`          | `labelAttributes`        |
| `description`    | `descriptionAttributes`  |
| `help`           | `helpAttributes`         |
| `errorsList`     | `errorsList`             |
| `textWidget`     | `text`                   |
| `numberWidget`   | `number`                 |
| `selectWidget`   | `select`                 |
| `checkboxWidget` | `checkbox`               |

Rules:

1. **Do not shadow core keys.** `title`, `description`, `help`, `clearable`,
   `enumNames`, `order`, `addable`, etc. already exist. A different type causes
   a declaration-merge conflict; that is why attribute bags use the
   `*Attributes` suffix.
2. **Prefix theme-specific keys.** When the value type is framework-specific or
   the key is new, use a theme prefix: `shadcn4Button`,
   `shadcn4DateFormatter`, `skeleton5Rating`, `skeleton5Combobox`. This avoids
   collisions when multiple themes are installed.
3. **Use lowerCamelCase** and name the option after the component or behavior,
   not the CSS class: `datePicker`, `multiSelect`, `emptyText`.
4. **Use plural keys for per-type maps** (`buttons`, `layouts`) and select the
   entry with the component's `type`.
5. **Reuse basic theme implementations when possible.** Importing
   `@sjsf/basic-theme/components/form.svelte` or another basic component brings
   its `UiOptions` augmentation with it. If you reimplement the component,
   redeclare the same key and type. If your wrapper exposes a different prop
   shape (for example a design-system button), define a prefixed option instead
   of reusing `button`.

The `UiOptions` augmentations in `packages/basic-theme/src/components` and
`packages/basic-theme/src/widgets` are the canonical generic keys. The docs
copy in `apps/docs2/src/content/docs/themes/basic/ui-options.ts` lists them in
one place.

### Example: scalar option

```svelte
<script lang="ts" module>
  declare module "@sjsf/form" {
    interface UiOptions {
      acmeShowCount?: boolean;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
    uiOption,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();
  const showCount = $derived(uiOption("acmeShowCount"));
  const attributes = $derived(
    inputAttributes(ctx, config, "text", handlers, { type: "text" })
  );
</script>

<input bind:value {...attributes} />
{#if showCount}
  <small>{value?.length ?? 0} characters</small>
{/if}
```

Fields and widgets can read scalar options with the `uiOption` prop; generic
components and other files use `retrieveUiOption(ctx, config, "...")`.
Attribute helpers only merge object-valued options.

## Step 4: Compose the Theme Resolver

A normal theme defines everything in `index.ts`:

```ts
// src/lib/index.ts
import { extendByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export const theme = extendByRecord(base, {
  ...components,
  ...widgets,
});
```

`base` provides all fields (`stringField`, `numberField`, `arrayField`,
`oneOfField`, ...) and templates (`fieldTemplate`, `objectTemplate`,
`arrayTemplate`, ...). The theme adds components and widgets that `base`
does not define.

When the theme must also replace a field or template supplied by `base`, use
`overrideByRecord`:

```ts
import { overrideByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";
import CustomFieldTemplate from "./templates/field.svelte";

export const theme = overrideByRecord(base, {
  ...components,
  ...widgets,
  fieldTemplate: CustomFieldTemplate,
});
```

`extendByRecord` asks `base` first, so it only **adds** types missing from
`base`. `overrideByRecord` asks the override record first, so it **replaces**
existing types and adds missing ones. `fromRecord` builds a resolver from a
single record; combine it with `chain` when you need a custom fallback order.

## Step 5: Add Extra Widgets (Optional)

Extra widgets are input controls beyond the four required ones. `@sjsf/form`
ships several predefined types; a theme can also define new ones. Registering
a widget only makes it available. Theme docs should state where each extra
widget is used by default; otherwise it must be selected explicitly in
`ui:components` or used as a field's default widget.

### Predefined extra widgets

Import the matching type module in the component's module script, implement
the widget, and register it:

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/rating";

  declare module "@sjsf/form" {
    interface UiOptions {
      acmeRating?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    inputAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["ratingWidget"] = $props();

  const ctx = getFormContext();
  const attributes = $derived(
    inputAttributes(ctx, config, "acmeRating", handlers, { type: "radio" })
  );
</script>
```

The `@sjsf/form/fields/extra-widgets/rating` import has no runtime value. It
loads the module augmentation for `ratingWidget`, so
`ComponentProps["ratingWidget"]` and `bind:value` type-check.

Add the widget to the theme's component map:

```ts
// src/lib/index.ts
import { extendByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";
import RatingWidget from "./extra-widgets/rating.svelte";

export const theme = extendByRecord(base, {
  ...components,
  ...widgets,
  ratingWidget: RatingWidget,
});
```

### New widget types

For a widget type that `@sjsf/form` does not ship, declare it in the theme
package. A widget type needs a `ComponentProps` entry and a `ComponentBindings`
entry:

```ts
// src/lib/widgets/color-widget.ts
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

declare module "@sjsf/form" {
  interface ComponentProps {
    acmeColorWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    acmeColorWidget: "value";
  }
}
```

Import this file from the widget component or the package entry point so the
augmentation is loaded.

Prefix the type name with the theme name. Implement the component like the
rating widget, using `ComponentProps["acmeColorWidget"]`, then register it
under the same key. Use it from the UI schema by mapping a foundational widget
to it:

```json
{
  "ui:components": {
    "textWidget": "acmeColorWidget"
  }
}
```

`acmeColorWidget` is compatible with `textWidget` because both use
`WidgetCommonProps<string>`.

A type belongs in `FoundationalComponents` only when some component resolves
it with `getComponent`. That call site is what makes the type replaceable
through `ui:components`; registering or replacing a type that no component
resolves has no effect. Add `acmeColorWidget` there only if a theme component
looks it up, for example a custom field that uses it as its default widget:

```ts
declare module "@sjsf/form" {
  interface FoundationalComponents {
    acmeColorWidget: {};
  }
}
```

A widget used only as a `ui:components` replacement does not need this entry.

## Step 6: Style the Theme

- Ship CSS as a package subpath (`./css/*.css` for static CSS, or
  `./styles.css` for extracted CSS) and document the import.
- Prefer the stable `data-*` attributes used by the official components:
  `data-type` on buttons, `data-layout` on layouts (written by
  `layoutAttributes`), and `data-template` on titles.
- Tailwind v4 themes need a `@source` directive pointing at the package
  `dist` directory in the consumer app.
- For Shadow DOM support, extracted CSS must use `:host` instead of `:root`.

## Step 7: Test and Publish

For a third-party theme, add a smoke test that creates a form with the theme
and asserts a widget renders and updates. The private `theme-testing` package is
available only inside this monorepo.

Publish with `svelte-package && publint` and document the peer dependencies
(`@sjsf/form`, `svelte`) and any stylesheet imports.

## Official Themes in This Monorepo

This section applies only to themes shipped from this repository. A third-party
theme needs a working `theme` export and the components/widgets it resolves to;
it does not need include modules, `./specs`, `theme-testing`, docs, meta
registration, or a changeset.

Official themes follow the same steps plus the conventions below. The full
release checklist is in
[Official Theme Checklist](references/official-theme-checklist.md).

### Shared definitions and include modules

Official themes ship extra widgets as opt-in `*-include.ts` modules. Because
each include module must mutate the same object used to build `theme`, these
themes extract the registry into `definitions.ts`:

```ts
// src/lib/definitions.ts
import type { ComponentDefinitions } from "@sjsf/form";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export interface ExtraWidgets {}

export const definitions = {
  ...components,
  ...widgets,
} satisfies Partial<ComponentDefinitions> as typeof components &
  typeof widgets &
  Pick<ComponentDefinitions, keyof ExtraWidgets>;
```

```ts
// src/lib/index.ts
import { extendByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import { definitions } from "./definitions.js";

export const theme = extendByRecord(base, definitions);
```

Each extra widget has a `.svelte` file and a matching include module:

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

The include module must mutate the shared `definitions` object; do not clone it
or create a new registry. Consumers import the include module for its side
effects:

```ts
import "@sjsf/<name>-theme/extra-widgets/rating-include";
```

### Specs and testing

`src/lib/specs.ts` must export `specs` and `extraWidgets`, import every
`*-include.ts` module, and import any core extra field includes used by the
specs:

```ts
import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/rating-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
  // ...
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
```

Expose it from `package.json`:

```json
"./specs": {
  "types": "./dist/specs.d.ts",
  "svelte": "./dist/specs.js"
}
```

`specs` and `extraWidgets` are consumed by the docs and the shared test
harness; they are not needed by `createForm`. Because the built `specs.js`
imports the private `theme-testing/specs` package, `./specs` is a
monorepo-only export. Third-party themes should omit it.

Run the shared browser and SSR contract suites:

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

Browser tests render through `tests/form.svelte`, which imports the theme
stylesheet and any include modules needed by the specs.

`theme-testing` is private/workspace-only; it stays a `devDependency` and must
not be imported from published runtime code.

Official themes also need a docs page/demo, meta registration, an example
starter, and a changeset. See the checklist for the full list.

## Gotchas & Rules

1. **`extendByRecord` does not override.** Use `overrideByRecord` for templates
   and fields already in `base`.
2. **`base` is required for fields and templates.** A resolver built only from
   components and widgets will fail to render structured schemas.
3. **UI options are global.** Reuse basic theme keys for equivalent components,
   prefix framework-specific keys with the theme name, and never redefine a
   core option with a different type.
4. **Augment `ComponentProps` and `ComponentBindings`** for new widget types so
   `ComponentProps["myWidget"]` and `bind:value` type-check. Also augment
   `FoundationalComponents` if the type is used with `getComponent`.
