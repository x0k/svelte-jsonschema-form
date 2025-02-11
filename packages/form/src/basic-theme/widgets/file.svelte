<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      file?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@/form/index.js";

  let {
    handlers,
    multiple,
    loading,
    processing,
    config,
    value = $bindable(),
  }: ComponentProps["fileWidget"] = $props();

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
