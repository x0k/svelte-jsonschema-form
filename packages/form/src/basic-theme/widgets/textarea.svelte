<script lang="ts" module>
  import type { HTMLTextareaAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      textarea?: HTMLTextareaAttributes;
    }
  }
</script>

<script lang="ts">
  import { getFormContext, textareaAttributes } from "@/form/index.js";
  import type { WidgetProps } from "@/fields/widgets.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: WidgetProps<"textarea"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    textareaAttributes(ctx, config, handlers, config.uiOptions?.textarea)
  );
</script>

<textarea bind:value style="flex-grow: 1;" {...attributes}></textarea>
