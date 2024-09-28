<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { value = $bindable(), attributes }: WidgetProps<"textarea"> = $props();
</script>

<textarea
  bind:value
  {...attributes}
  style={`flex-grow: 1; ${attributes?.style || ""}`}
></textarea>
