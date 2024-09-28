<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { attributes, value = $bindable() }: WidgetProps<"email"> = $props();
</script>

<input type="email" bind:value style="flex-grow: 1" {...attributes} />
