<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    config,
    value = $bindable(),
    attributes,
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input type="checkbox" bind:checked={value} {...attributes} />
  {config.name}
</label>
