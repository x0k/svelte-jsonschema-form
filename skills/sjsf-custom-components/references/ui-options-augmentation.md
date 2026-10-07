# TypeScript Augmentation for Custom Components and UI Options

SJSF allows complete type safety when adding custom widgets or custom `ui:options` via TypeScript module declaration merging.

## 1. Augmenting `ComponentProps` & `ComponentBindings`

When introducing a new component or widget type to `@sjsf/form`:

```ts
import type { ComponentProps } from "@sjsf/form";

declare module "@sjsf/form" {
  interface ComponentProps {
    // Prefix custom component names to prevent conflicts
    colorPickerWidget: ComponentProps["textWidget"];
    ratingWidget: ComponentProps["numberWidget"];
  }

  interface ComponentBindings {
    colorPickerWidget: "value";
    ratingWidget: "value";
  }
}
```

---

## 2. Augmenting `UiOptions`

To add custom properties to `ui:options`:

```ts
declare module "@sjsf/form" {
  interface UiOptions {
    /** Show clear button in text widgets */
    showClearButton?: boolean;

    /** Star rating max score */
    ratingMax?: number;

    /** Custom CSS classes passed to input */
    inputClass?: string;
  }
}
```

---

## 3. Reading Options in Svelte 5 Components

### Direct helper `uiOption`
In component `$props`:
```svelte
<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
    uiOption,
  }: ComponentProps["colorPickerWidget"] = $props();

  const clearable = $derived(uiOption("showClearButton") ?? false);
  const inputClass = $derived(uiOption("inputClass") ?? "");
</script>
```

### Merging props with `uiOptionProps`
When merging options between UI schema and `extraUiOptions`:
```ts
import { getFormContext, uiOptionProps } from "@sjsf/form";

const ctx = getFormContext();
const mergedOptions = $derived(uiOptionProps(ctx, config, "myOptionsKey"));
```
