<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { value = $bindable(), attributes }: WidgetProps<"number"> = $props();
</script>

<input type="number" bind:value {...attributes} />
