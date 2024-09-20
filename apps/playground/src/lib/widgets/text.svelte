<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { id, value = $bindable() }: WidgetProps<"text"> = $props();
</script>

<input type="text" {id} name={id} bind:value />
