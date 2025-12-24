<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/color-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      colorPicker?: HTMLInputAttributes;
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
    handlers,
    config,
    value = $bindable(),
  }: ComponentProps["colorPickerWidget"] = $props();

  const ctx = getFormContext();
</script>

<input
  bind:value
  {...inputAttributes(ctx, config, "colorPicker", handlers, {
    type: "color",
    class: "sjsf-color-picker",
  })}
/>
