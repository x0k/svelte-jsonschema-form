<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let { value = $bindable(), attributes }: WidgetProps<"textarea"> = $props();
</script>

<textarea bind:value {...attributes}></textarea>
