<script lang="ts">
  import type { WidgetProps } from "@/form";

  let {
    attributes,
    multiple,
    loading,
    processing,
    value = $bindable(),
  }: WidgetProps<"file"> = $props();
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
