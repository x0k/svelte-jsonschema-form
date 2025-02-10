<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      checkbox?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import type { WidgetProps } from "@/fields/widgets.js";
  import { getFormContext, inputAttributes } from "@/form/index.js";

  let {
    config,
    value = $bindable(),
    handlers,
  }: WidgetProps<"checkbox"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.checkbox)
  );
</script>

<label>
  <input type="checkbox" bind:checked={value} {...attributes} />
  {config.title}
</label>
