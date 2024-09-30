<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    attributes,
    multiple,
    loading,
    value = $bindable(),
  }: WidgetProps<"file"> = $props();
</script>

<input
  type="file"
  bind:files={value}
  {multiple}
  style="flex-grow: 1"
  data-loading={loading}
  {...attributes}
/>
