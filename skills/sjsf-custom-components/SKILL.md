---
name: sjsf-custom-components
description: Create custom widgets, field templates, and component adapters for svelte-jsonschema-form in Svelte 5. Use when creating custom input controls, overriding theme components, extending theme resolvers with overrideByRecord/extendByRecord, typing props with ComponentProps, or augmenting UiOptions.
---

# SJSF Custom Components

This skill explains how to build custom widgets, modify theme components, and extend field templates in `svelte-jsonschema-form` (v3) using Svelte 5 runes.

## Step 1: Writing a Custom Widget Component

Custom widgets must accept `$bindable()` for `value`, `config`, and `handlers`.

Example: A custom color picker widget (`color-picker-widget.svelte`):

```svelte
<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
    uiOption
  }: ComponentProps["textWidget"] = $props();

  const id = $derived(config.id);
  const disabled = $derived(config.disabled);
  const placeholder = $derived(uiOption("placeholder") ?? "#000000");
</script>

<div class="color-picker-container">
  <input
    {id}
    type="color"
    bind:value={value}
    {disabled}
    oninput={handlers.input}
    onblur={handlers.blur}
    onfocus={handlers.focus}
  />
  <input
    type="text"
    bind:value={value}
    {placeholder}
    {disabled}
    oninput={handlers.input}
    onblur={handlers.blur}
  />
</div>
```

See [Component Types Reference](references/component-types.md) for available component and widget prop signatures.

---

## Step 2: Replacing Components via UI Schema

To use a custom component for a specific field or across the form without altering the global theme, specify it in `uiSchema`:

```svelte
<script lang="ts">
  import { createForm, BasicForm, type Schema, type UiSchema } from "@sjsf/form";
  import * as defaults from "$lib/sjsf/defaults";
  import ColorPickerWidget from "./color-picker-widget.svelte";

  const schema = {
    type: "object",
    properties: {
      brandColor: { type: "string", title: "Theme Color" }
    }
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    brandColor: {
      "ui:components": {
        textWidget: ColorPickerWidget
      }
    }
  };

  const form = createForm({
    ...defaults,
    schema,
    uiSchema
  });
</script>

<BasicForm {form} />
```

---

## Step 3: Overriding Theme Globally with `overrideByRecord`

To replace standard widgets (or templates) across your entire app, wrap your theme using `overrideByRecord` or `extendByRecord`:

```ts
// src/lib/sjsf/theme.ts
import { overrideByRecord } from "@sjsf/form/lib/resolver";
import { theme as baseTheme } from "@sjsf/shadcn4-theme";
import CustomTextWidget from "./custom-text-widget.svelte";
import CustomFieldTemplate from "./custom-field-template.svelte";

export const theme = overrideByRecord(baseTheme, {
  textWidget: CustomTextWidget,
  fieldTemplate: CustomFieldTemplate
});
```

Export this modified `theme` from `src/lib/sjsf/defaults.ts`.

---

## Step 4: Custom UI Options & Type Augmentation

When your widget needs custom flags (e.g. `ui:options: { showPreview: true }`):

```ts
// src/app.d.ts or src/lib/sjsf/types.d.ts
import type { ComponentProps } from "@sjsf/form";

declare module "@sjsf/form" {
  interface UiOptions {
    showPreview?: boolean;
    colorPresets?: string[];
  }
}
```

Read this in your widget using `uiOption("showPreview")`.

See [UI Options Augmentation Reference](references/ui-options-augmentation.md) for full TypeScript recipes.

---

## Gotchas & Rules

1. **Nullable Values**: Schemas with nullable types (e.g. `type: ["string", "null"]`) can pass `null` or `undefined` into your widget. Always handle fallback values:
   ```svelte
   <input bind:value={() => value ?? "", (v) => value = v || null} />
   ```
2. **Event Attachment via `handlers`**: Always forward `oninput={handlers.input}` and `onblur={handlers.blur}` so SJSF can trigger live validation according to `fieldsValidationMode`.
3. **Queries vs Commands in Form Context**:
   - Queries (`retrieveUiOption`, `getFieldErrors`, `getId`) track reactive dependencies.
   - Commands (`updateErrors`, `setValue`, `validateField`) do not track dependencies and are used in callbacks.
