<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      file?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import { getFormContext, inputAttributes } from "@/form/index.js";
  import type { WidgetProps } from "@/fields/widgets.js";

  let {
    handlers,
    multiple,
    loading,
    processing,
    config,
    value = $bindable(),
  }: WidgetProps<"file"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.file)
  );
</script>

<input
  type="file"
  bind:files={value}
  {multiple}
  style="flex-grow: 1"
  data-loading={loading}
  data-processing={processing}
  {...attributes}
/>
