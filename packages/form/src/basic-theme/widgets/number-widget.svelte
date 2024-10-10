<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  let { value = $bindable(), attributes }: WidgetProps<"number"> = $props();
</script>

{#if attributes.type === "range"}
  <span style="padding: 0 1rem; min-width: 3ex;">
    {value}
  </span>
{/if}
<input type="number" bind:value style="flex-grow: 1" {...attributes} />
