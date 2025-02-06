<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type WidgetProps,
  } from "@/form/index.js";

  let {
    handlers,
    multiple,
    loading,
    processing,
    config,
    value = $bindable(),
  }: WidgetProps<"file"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(inputAttributes(ctx, config, handlers));
</script>

<input
  type="file"
  bind:files={value}
  {multiple}
  style="flex-grow: 1"
  data-loading={loading}
  data-processing={processing}
  {...attributes}
/>
