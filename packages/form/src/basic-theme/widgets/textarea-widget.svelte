<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  let { value = $bindable(), attributes }: WidgetProps<"textarea"> = $props();
</script>

<textarea bind:value style="flex-grow: 1;" {...attributes}></textarea>
