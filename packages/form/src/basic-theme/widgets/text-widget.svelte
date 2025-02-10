<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      text?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import type { WidgetProps } from "@/fields/widgets.js";
  import { getFormContext, inputAttributes } from "@/form/index.js";

  let { value = $bindable(), config, handlers }: WidgetProps<"text"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.text)
  );
</script>

<input type="text" bind:value style="flex-grow: 1" {...attributes} />
