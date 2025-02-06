<script lang="ts">
  import { getFormContext, textareaAttributes, type WidgetProps } from "@/form/index.js";

  let { value = $bindable(), config, handlers }: WidgetProps<"textarea"> = $props();

  const ctx = getFormContext()

  const attributes = $derived(textareaAttributes(ctx, config, handlers))
</script>

<textarea bind:value style="flex-grow: 1;" {...attributes}></textarea>
