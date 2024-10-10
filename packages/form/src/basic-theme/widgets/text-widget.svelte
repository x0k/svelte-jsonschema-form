<script lang="ts">
  import { type WidgetProps } from "@/form/index.js";

  let { value = $bindable(), attributes }: WidgetProps<"text"> = $props();
</script>

<input type="text" bind:value style="flex-grow: 1" {...attributes} />
