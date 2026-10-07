---
name: sjsf-custom-components
description: Create custom widgets, field templates, and component adapters for svelte-jsonschema-form in Svelte 5. Use when creating custom input controls, overriding theme components, extending theme resolvers with overrideByRecord/extendByRecord, typing props with ComponentProps, or augmenting UiOptions.
---

# SJSF Custom Components

This skill explains how to build custom widgets, modify theme components, and extend field templates in `svelte-jsonschema-form` (v3) using Svelte 5 runes.

## Step 1: Writing a Custom Widget Component

Custom widgets receive `value = $bindable()`, `config`, and `handlers`.
For native elements, build props with `inputAttributes`:

```svelte
<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      myColorPicker?: HTMLInputAttributes;
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
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "myColorPicker", handlers, { type: "color" })
  );
</script>

<input bind:value {...attributes} />
```

If your widget renders a wrapper component instead of a native element
directly, keep spreading — the attachment (a symbol-keyed prop inside
`attributes`) forwards through each spread until it lands on a native element:

```svelte
<!-- color-picker-widget.svelte (attributes from above) -->
<MyWrapper bind:value {...attributes} />
```

```svelte
<!-- MyWrapper.svelte -->
<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  let { value = $bindable(), ...rest }: HTMLInputAttributes = $props();
</script>

<input bind:value {...rest} />
```

Only when the third-party input does NOT forward spreads/attachments
(e.g. bits-ui / skeleton components with explicit `onValueChange` props),
map `handlers: { oninput, onchange, onblur }` (`Handlers` in
`WidgetCommonProps`) to its event props via spread. Call manually only inside
your own handler when you also do work (filtering, value mapping):

```svelte
<CustomInput {value} {...handlers} />
```

```ts
// When you wrap the event with extra logic:
function handleValueChange(details: { value: string }) {
  value = details.value;
  handlers.oninput?.();
  handlers.onchange?.();
}
```

See [Component Types Reference](references/component-types.md) for available component and widget prop signatures.

---

## Step 2: Replacing Components via UI Schema

To use a custom component for a specific field or across the form without altering the global theme, specify it in `uiSchema`:

```svelte
<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchema,
  } from "@sjsf/form";
  import * as defaults from "$lib/sjsf/defaults";
  import ColorPickerWidget from "./color-picker-widget.svelte";

  const schema = {
    type: "object",
    properties: {
      brandColor: { type: "string", title: "Theme Color" },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    brandColor: {
      "ui:components": {
        textWidget: ColorPickerWidget,
      },
    },
  };

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
  });
</script>

<BasicForm {form} />
```

---

## Step 3: Overriding Theme Globally with `overrideByRecord`

`extendByRecord` registers new components; `overrideByRecord` replaces existing ones:

```ts
// src/lib/sjsf/theme.ts
import { overrideByRecord } from "@sjsf/form/lib/resolver";
import { theme as baseTheme } from "@sjsf/shadcn4-theme";
import CustomTextWidget from "./custom-text-widget.svelte";
import CustomFieldTemplate from "./custom-field-template.svelte";

export const theme = overrideByRecord(baseTheme, {
  textWidget: CustomTextWidget,
  fieldTemplate: CustomFieldTemplate,
});
```

Export this modified `theme` from `src/lib/sjsf/defaults.ts`.

---

## Step 4: Custom UI Options & Type Augmentation

Namespace custom widget options under one prefixed key:

```ts
// src/lib/sjsf/types.d.ts
import type { HTMLInputAttributes } from "svelte/elements";

declare module "@sjsf/form" {
  interface UiOptions {
    myColorPicker?: HTMLInputAttributes;
  }
}
```

Set via `"ui:options": { myColorPicker: { ... } }`.
Read with `uiOption("myColorPicker")`, or merge a custom option bag
with `composeProps` — include the common steps (`inputProps` for
`id`/`name`/`required`, `disabledProp`, aria helpers), not just
`uiOptionProps` alone:

```ts
import {
  ariaDescribedByProp,
  ariaInvalidProp,
  composeProps,
  disabledProp,
  getFormContext,
  inputProps,
  uiOptionProps,
} from "@sjsf/form";

const ctx = getFormContext();
const props = $derived(
  composeProps(
    ctx,
    config,
    { type: "color" },
    inputProps,
    uiOptionProps("myColorPicker"),
    disabledProp,
    ariaInvalidProp,
    ariaDescribedByProp
  )
);
```

For native elements skip the hand-rolled chain and use `inputAttributes`
(Step 1) — it composes all of the above plus the `handlers` attachment.

See [UI Options Augmentation Reference](references/ui-options-augmentation.md) for full TypeScript recipes.

---

## Gotchas & Rules

1. **Nullable Values**: Widgets receive `value: V | undefined`. For text inputs map empty to `undefined`:
   ```svelte
   <input bind:value={() => value ?? "", (v) => (value = v || undefined)} />
   ```
2. **Event Attachment via `handlers`**: `inputAttributes`/`selectAttributes`/`textareaAttributes` embed `handlersAttachment(handlers)` (symbol-keyed `@attach`, forwarded through spreads). Spread `{...attributes}` and do nothing else. Only if the custom input drops attachments, map by reference (`onValueChange: handlers.oninput`) or call `handlers.oninput?.()` inside your own wrapper handler. `Config` has no `id`/`disabled`.
3. **Queries vs Commands in Form Context**:
   - Queries (`retrieveUiOption`, `getFieldErrors`, `getId`) track reactive dependencies.
   - Commands (`updateErrors`, `setValue`, `validateField`) do not track dependencies and are used in callbacks.
