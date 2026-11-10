# SJSF Theme Contract

This reference describes the minimum surface a theme must implement and the
attribute helpers used to build it.

## Resolver and Base

A theme is a resolver, not a Svelte component. A normal theme defines
everything in `index.ts`:

```ts
import { extendByRecord } from "@sjsf/form/lib/resolver";
import { base } from "@sjsf/form/theme";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export const theme = extendByRecord(base, {
  ...components,
  ...widgets,
});
```

`base` supplies:

- **Fields**: `stringField`, `numberField`, `integerField`, `booleanField`,
  `objectField`, `objectPropertyField`, `arrayField`, `tupleField`,
  `arrayItemField`, `nullField`, `oneOfField`, `anyOfField`, `unknownField`,
  `expandField`.
- **Templates**: `fieldTemplate`, `objectTemplate`,
  `objectPropertyTemplate`, `arrayTemplate`, `arrayItemTemplate`,
  `multiFieldTemplate`.

The theme supplies components, widgets, and optional overrides. Official-only
conventions such as opt-in include modules are covered by the
[official checklist](official-theme-checklist.md).

## Required Types

| Type             | Props                                                                                                                       | Helper                                                                |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `form`           | `config`, `ref` (bindable), `children`, `attributes`                                                                        | `formAttributes(ctx, config, option, attributes, defaults)`           |
| `submitButton`   | `config`, `children`                                                                                                        | `buttonAttributes(ctx, config, option, "submit", defaults)`           |
| `button`         | `type`, `disabled`, `onclick`, `config`, `errors`, `children`                                                               | `composeProps(..., uiOptionProps, uiOptionNestedProps, disabledProp)` |
| `layout`         | `type`, `config`, `errors`, `children`                                                                                      | `layoutAttributes(ctx, config, option, nested, type, defaults)`       |
| `title`          | `title`, `templateType`, `config`, `errors`                                                                                 | `titleAttributes(ctx, config, option, defaults)`                      |
| `label`          | `title`, `config`, `errors`                                                                                                 | `labelAttributes(ctx, config, option, defaults)`                      |
| `description`    | `description`, `templateType`, `config`, `errors`                                                                           | `descriptionAttributes(ctx, config, option, defaults)`                |
| `help`           | `help`, `config`, `errors`                                                                                                  | `helpAttributes(ctx, config, option, defaults)`                       |
| `errorsList`     | `errors`, `config`                                                                                                          | `errorsListAttributes(ctx, config, option, defaults)`                 |
| `textWidget`     | `value` (bindable), `config`, `handlers`, `errors`, `uiOption`                                                              | `inputAttributes(ctx, config, option, handlers, defaults)`            |
| `numberWidget`   | same as `textWidget` with `number`                                                                                          | `inputAttributes(...)`                                                |
| `selectWidget`   | `value` (bindable `SchemaValue`), `config`, `handlers`, `errors`, `uiOption`, `options`, `mapper?`, `clearable?`, `mapped?` | `selectAttributes(ctx, config, option, handlers, defaults)`           |
| `checkboxWidget` | same as `textWidget` with `boolean`                                                                                         | `inputAttributes(...)`                                                |

Widget props are typed as `WidgetCommonProps<V>`:

```ts
interface WidgetCommonProps<V> {
  type: "widget";
  config: Config;
  value: V | undefined;
  handlers: {
    oninput?: () => void;
    onchange?: () => void;
    onblur?: () => void;
  };
  errors: FieldErrors;
  uiOption: UiOption;
}
```

Use `ComponentProps["form"]`, `ComponentProps["textWidget"]`, etc. to avoid
repeating the prop shapes.

## Attribute Helpers

Prefer the pre-composed `*Attributes` helpers over hand-building props:

```ts
// Native input / select / textarea
inputAttributes(ctx, config, "text", handlers, defaults);
selectAttributes(ctx, config, "select", handlers, defaults);
textareaAttributes(ctx, config, "textarea", handlers, defaults);

// Third-party input component (no native element)
customInputAttributes(ctx, config, "myComponent", defaults);

// Generic components
formAttributes(ctx, config, "form", attributes, defaults);
buttonAttributes(ctx, config, "submitButton", "submit", defaults);
layoutAttributes(ctx, config, "layout", "layouts", type, defaults);
titleAttributes(ctx, config, "titleAttributes", defaults);
labelAttributes(ctx, config, "labelAttributes", defaults);
descriptionAttributes(ctx, config, "descriptionAttributes", defaults);
helpAttributes(ctx, config, "helpAttributes", defaults);
errorsListAttributes(ctx, config, "errorsList", defaults);
```

For custom buttons or composed props, use the lower-level helpers:

```ts
composeProps(
  ctx,
  config,
  { disabled, type: "button", onclick } satisfies HTMLButtonAttributes,
  uiOptionProps("button"),
  uiOptionNestedProps("buttons", (p) => p[type]),
  disabledProp
);
```

`inputAttributes`, `selectAttributes`, and `textareaAttributes` also install
`handlersAttachment(handlers)`. Spread the returned object onto a native
element and do not invoke `handlers` manually.

## UI Options

`UiOptions` is the global interface used by `ui:options` and
`ui:globalOptions`. Core options (`title`, `description`, `help`, `clearable`,
`enumNames`, `order`, `addable`, `validationMode`, ...) are defined by
`@sjsf/form` and its field modules. Themes augment `UiOptions` for their
component-specific options.

### Declaring an option

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

The declaration must be part of the type graph that consumers import. Put it in
the component's module script (as official themes do) or in a shared
`ui-options.ts` that is imported from the package entry point.

### Reading an option

- Object-valued options can be passed directly to an attribute helper:
  `inputAttributes(ctx, config, "text", handlers, defaults)`. The helper merges
  defaults, `ui:options`, `ui:globalOptions`, and `extraUiOptions`.
- Scalar options use `retrieveUiOption(ctx, config, "myOption")`, or the
  field/widget `uiOption` reader: `uiOption("myOption")`.
- Per-type maps use `uiOptionNestedProps("buttons", (b) => b[type])` or
  `retrieveNestedUiOption(ctx, config, "buttons", (b) => b[type])`.
- Generic components do not receive the `uiOption` prop; use
  `retrieveUiOption` there.

`uiOptionProps` only accepts object-valued options (`ObjectUiOptions`). That is
why scalar options must be read with `retrieveUiOption`.

`extraUiOptions` (the `createForm` option) is for values that cannot be
serialized in `ui:options`, such as functions or component registries. It takes
precedence over `ui:options` and `ui:globalOptions`.

### Naming

Use the basic theme's keys for equivalent components:

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

- **Do not shadow core keys.** `title`, `description`, `help`, `clearable`,
  `enumNames`, `order`, `addable`, etc. already exist. A different type causes
  a declaration-merge conflict; that is why attribute bags use the
  `*Attributes` suffix.
- **Prefix theme-specific keys.** When the value type is framework-specific or
  the key is new, use a theme prefix: `shadcn4Button`,
  `shadcn4DateFormatter`, `skeleton5Rating`, `skeleton5Combobox`. This avoids
  collisions when multiple themes are installed.
- **Use lowerCamelCase** and name the option after the component or behavior,
  not the CSS class: `datePicker`, `multiSelect`, `emptyText`.
- **Use plural keys for per-type maps** (`buttons`, `layouts`) and select the
  entry with the component's `type`.
- **Reuse basic theme implementations when possible.** Importing
  `@sjsf/basic-theme/components/form.svelte` or another basic component brings
  its `UiOptions` augmentation with it. If you reimplement the component,
  redeclare the same key and type. If your wrapper exposes a different prop
  shape (for example a design-system button), define a prefixed option instead
  of reusing `button`.

The basic theme's `UiOptions` declarations live in
`packages/basic-theme/src/components/*.svelte` and
`packages/basic-theme/src/widgets/*.svelte`. The docs page consolidates them in
`apps/docs2/src/content/docs/themes/basic/ui-options.ts`.

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

## Component Examples

### `form.svelte`

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
  {...formAttributes(ctx, config, "form", attributes, { class: "my-form" })}
>
  {@render children()}
</form>
```

### `submit-button.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      submitButton?: HTMLButtonAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    buttonAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();
  const ctx = getFormContext();
</script>

<button
  {...buttonAttributes(ctx, config, "submitButton", "submit", {
    class: "my-submit",
  })}
>
  {@render children()}
</button>
```

### `button.svelte`

```svelte
<script lang="ts" module>
  import type { ButtonType } from "@sjsf/form/fields/components";
  import type { HTMLButtonAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      button?: HTMLButtonAttributes;
      buttons?: {
        [B in ButtonType]?: HTMLButtonAttributes;
      };
    }
  }
</script>

<script lang="ts">
  import {
    composeProps,
    disabledProp,
    getFormContext,
    uiOptionNestedProps,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  const {
    children,
    type,
    onclick,
    config,
    disabled,
  }: ComponentProps["button"] = $props();

  const ctx = getFormContext();
</script>

<button
  {...composeProps(
    ctx,
    config,
    {
      disabled,
      type: "button",
      "data-type": type,
      class: "my-button",
      onclick,
    } satisfies HTMLButtonAttributes,
    uiOptionProps("button"),
    uiOptionNestedProps("buttons", (p) => p[type]),
    disabledProp
  )}
>
  {@render children()}
</button>
```

### `layout.svelte`

```svelte
<script lang="ts" module>
  import type { LayoutType } from "@sjsf/form/fields/components";
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      layout?: HTMLAttributes<HTMLDivElement>;
      layouts?: {
        [L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
      };
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    layoutAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { type, children, config }: ComponentProps["layout"] = $props();
  const ctx = getFormContext();

  const attributes = $derived(
    layoutAttributes(ctx, config, "layout", "layouts", type, {
      class: "my-layout",
    })
  );
</script>

<div {...attributes}>
  {@render children()}
</div>
```

### `title.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/title";

  declare module "@sjsf/form" {
    interface UiOptions {
      titleAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config, templateType }: ComponentProps["title"] = $props();
  const ctx = getFormContext();
</script>

<legend
  {...titleAttributes(ctx, config, "titleAttributes", {
    class: "my-title",
    "data-template": templateType,
  })}
>
  {title}
  {#if config.required && templateType === "fieldTemplate"}*{/if}
</legend>
```

### `label.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLLabelAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/label";

  declare module "@sjsf/form" {
    interface UiOptions {
      labelAttributes?: HTMLLabelAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    labelAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config }: ComponentProps["label"] = $props();
  const ctx = getFormContext();
</script>

<label
  {...labelAttributes(ctx, config, "labelAttributes", { class: "my-label" })}
>
  {title}
  {#if config.required}<span>*</span>{/if}
</label>
```

### `description.svelte`, `help.svelte`, `errors-list.svelte`

```svelte
<!-- description.svelte -->
<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/description";

  declare module "@sjsf/form" {
    interface UiOptions {
      descriptionAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();
  const ctx = getFormContext();
</script>

<div
  {...descriptionAttributes(ctx, config, "descriptionAttributes", {
    class: "my-description",
  })}
>
  {description}
</div>
```

```svelte
<!-- help.svelte -->
<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/help";

  declare module "@sjsf/form" {
    interface UiOptions {
      helpAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    helpAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { help, config }: ComponentProps["help"] = $props();
  const ctx = getFormContext();
</script>

<div {...helpAttributes(ctx, config, "helpAttributes", { class: "my-help" })}>
  {help}
</div>
```

```svelte
<!-- errors-list.svelte -->
<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/errors-list";

  declare module "@sjsf/form" {
    interface UiOptions {
      errorsList?: HTMLAttributes<HTMLUListElement>;
    }
  }
</script>

<script lang="ts">
  import {
    errorsListAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { errors, config }: ComponentProps["errorsList"] = $props();
  const ctx = getFormContext();
</script>

<ul
  {...errorsListAttributes(ctx, config, "errorsList", { class: "my-errors" })}
>
  {#each errors as error, index (index)}
    <li>{error}</li>
  {/each}
</ul>
```

## Widget Examples

### `text.svelte`

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

### `number.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      number?: HTMLInputAttributes;
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
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();
  const attributes = $derived(
    inputAttributes(ctx, config, "number", handlers, {
      type: "number",
      class: "my-number",
    })
  );
</script>

<input
  bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
  {...attributes}
/>
<Datalist id={attributes.list} {config} />
```

### `checkbox.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      checkbox?: HTMLInputAttributes;
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
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();
  const attributes = $derived(
    inputAttributes(ctx, config, "checkbox", handlers, { type: "checkbox" })
  );
</script>

<label class="my-checkbox">
  <input
    type="checkbox"
    bind:checked={() => value ?? false, (v) => (value = v)}
    {...attributes}
  />
  {config.title}
</label>
```

### `select.svelte`

```svelte
<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      select?: HTMLSelectAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    EMPTY_VALUE,
    idMapper,
    singleOption,
  } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
    options,
    clearable = config.schema.default === undefined,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();
  const { placeholder, ...attributes } = $derived(
    selectAttributes(ctx, config, "select", handlers, {
      class: "my-select",
    })
  );
</script>

<select bind:value={mapped.current} {...attributes}>
  {#if clearable}
    <option value={EMPTY_VALUE}>{placeholder}</option>
  {/if}
  {#each options as option (option.id)}
    <option value={option.mappedValue ?? option.id} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
```

## Registering Extra Widget Types

Predefined extra widget types ship a type module that must be imported for its
module augmentation:

```svelte
<script lang="ts" module>
  import "@sjsf/form/fields/extra-widgets/rating";
</script>
```

Then the component can use `ComponentProps["ratingWidget"]` and `bind:value`.

For new widget types (not shipped by `@sjsf/form`), declare the registry
entries in the theme package:

```ts
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

declare module "@sjsf/form" {
  interface ComponentProps {
    myWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    myWidget: "value";
  }
}
```

Import the declaration file from the widget component or the package entry
point so the augmentation is loaded. Implement the component with
`ComponentProps["myWidget"]`, register it in the resolver, and map a
foundational widget to it in the UI schema:

```json
{
  "ui:components": {
    "textWidget": "myWidget"
  }
}
```

The mapped type must be compatible with the foundational widget; for example,
`WidgetCommonProps<string>` is compatible with `textWidget`.

A type belongs in `FoundationalComponents` only when a component calls
`getComponent` with it. That call site is what makes the type replaceable via
`ui:components`; registering or replacing a type that nothing resolves has no
effect. Add the entry only if the theme itself looks the widget up, for example
from a field that uses it as its default widget:

```ts
declare module "@sjsf/form" {
  interface FoundationalComponents {
    myWidget: {};
  }
}
```

A widget used only as a `ui:components` replacement does not need this entry.
Theme docs should explain where each extra widget is used by default.

## Resolver Composition Cheat Sheet

```ts
// Add components/widgets that base does not define
extendByRecord(base, { ...components, ...widgets });

// Replace a template or field from base
overrideByRecord(theme, { fieldTemplate: CustomFieldTemplate });

// Add missing types and replace existing ones
overrideByRecord(base, { ...components, ...widgets, ...overrides });

// Add new types to an existing theme without replacing anything
extendByRecord(existingTheme, { myWidget: MyWidget });
```
