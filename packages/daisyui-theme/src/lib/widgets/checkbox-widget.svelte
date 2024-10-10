<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  let {
    config,
    value = $bindable(),
    attributes,
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input type="checkbox" bind:checked={value} {...attributes} />
  {config.title}
</label>
