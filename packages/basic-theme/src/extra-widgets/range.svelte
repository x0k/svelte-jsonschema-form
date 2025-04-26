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
    retrieveAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["rangeWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    retrieveAttributes(ctx, config, "range", inputAttributes(handlers))
  );
</script>

<input
  type="range"
  bind:value={() => value ?? 0, (v) => (value = v)}
  style="flex-grow: 1"
  {...attributes}
/>
