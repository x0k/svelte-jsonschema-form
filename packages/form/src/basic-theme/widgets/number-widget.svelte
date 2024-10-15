<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  let { value = $bindable(), attributes }: WidgetProps<"number"> = $props();
</script>

<input type="number" bind:value style="flex-grow: 1" {...attributes} />
