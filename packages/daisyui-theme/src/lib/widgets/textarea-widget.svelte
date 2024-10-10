<script lang="ts">
  import type { WidgetProps } from "@sjsf/form";

  let { value = $bindable(), attributes }: WidgetProps<"textarea"> = $props();
</script>

<textarea bind:value class="textarea textarea-bordered textarea-sm grow" {...attributes}></textarea>
