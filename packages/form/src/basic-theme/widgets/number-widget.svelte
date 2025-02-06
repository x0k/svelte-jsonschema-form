<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type WidgetProps,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: WidgetProps<"number"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(inputAttributes(ctx, config, handlers));
</script>

<input type="number" bind:value style="flex-grow: 1" {...attributes} />
