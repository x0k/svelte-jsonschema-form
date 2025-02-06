<script lang="ts">
  import { getFormContext, inputAttributes, type WidgetProps } from "@/form/index.js";

  let {
    config,
    value = $bindable(),
    handlers,
  }: WidgetProps<"checkbox"> = $props();

  const ctx = getFormContext()

  const attributes = $derived(inputAttributes(ctx, config, handlers))
</script>

<label>
  <input type="checkbox" bind:checked={value} {...attributes} />
  {config.title}
</label>
