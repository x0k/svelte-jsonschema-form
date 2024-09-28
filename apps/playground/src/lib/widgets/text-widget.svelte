<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { value = $bindable(), attributes }: WidgetProps<"text"> = $props();
</script>

<input
  type="text"
  bind:value
  {...attributes}
  style={`flex-grow: 1; ${attributes?.style || ""}`}
/>
