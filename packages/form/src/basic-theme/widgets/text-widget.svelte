<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type WidgetProps,
  } from "@/form/index.js";

  let { value = $bindable(), config, handlers }: WidgetProps<"text"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(inputAttributes(ctx, config, handlers));
</script>

<input type="text" bind:value style="flex-grow: 1" {...attributes} />
