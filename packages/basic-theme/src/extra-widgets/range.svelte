<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/range";

  declare module "@sjsf/form" {
    interface UiOptions {
      range?: HTMLInputAttributes;
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
  }: ComponentProps["rangeWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(
      ctx,
      config,
      handlers,
      config.uiOptions?.range,
      ctx.extraUiOptions?.("range", config)
    )
  );
</script>

<input
  type="range"
  bind:value={() => value ?? 0, (v) => (value = v)}
  style="flex-grow: 1"
  {...attributes}
/>
