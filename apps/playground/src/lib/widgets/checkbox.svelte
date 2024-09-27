<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    label,
    value = $bindable(),
    attributes,
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input type="checkbox" bind:checked={value} {...attributes} />
  {label}
</label>
