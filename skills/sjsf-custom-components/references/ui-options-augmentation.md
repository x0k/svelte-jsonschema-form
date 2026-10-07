# TypeScript Augmentation for Custom Components and UI Options

SJSF allows complete type safety when adding custom widgets or custom `ui:options` via TypeScript module declaration merging.

## 1. Augmenting `ComponentProps` & `ComponentBindings`

When introducing a new component or widget type to `@sjsf/form`:

```ts
import type { ComponentProps } from "@sjsf/form";

declare module "@sjsf/form" {
  interface ComponentProps {
    myColorPickerWidget: ComponentProps["textWidget"];
    myRatingWidget: ComponentProps["numberWidget"];
  }

  interface ComponentBindings {
    myColorPickerWidget: "value";
    myRatingWidget: "value";
  }
}
```

---

## 2. Augmenting `UiOptions`

Prefix custom keys. Prefer one namespaced object per widget,
matching the theme pattern (`text?: HTMLInputAttributes`):

```ts
import type { HTMLInputAttributes } from "svelte/elements";

declare module "@sjsf/form" {
  interface UiOptions {
    myColorPicker?: HTMLInputAttributes;
    myRating?: { max?: number; showClearButton?: boolean };
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
  }: ComponentProps["myColorPickerWidget"] = $props();

  const myProps = $derived(uiOption("myColorPicker"));
</script>
```

### Merging props with `uiOptionProps`

Pass it as a step to `composeProps` (`inputAttributes` and friends
do this internally):

```ts
import { composeProps, getFormContext, uiOptionProps } from "@sjsf/form";

const ctx = getFormContext();
const props = $derived(
  composeProps(ctx, config, { type: "color" }, uiOptionProps("myColorPicker"))
);
```
