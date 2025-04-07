<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/file";

  declare module "@sjsf/form" {
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
  } from "@sjsf/form";

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
    inputAttributes(
      ctx,
      config,
      handlers,
      config.uiOptions?.file,
      ctx.extraUiOptions?.("file", config)
    )
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
