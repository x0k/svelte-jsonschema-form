<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      text?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(
      ctx,
      config,
      handlers,
      config.uiOptions?.text,
      ctx.extraUiOptions?.("text", config)
    )
  );
</script>

<input type="text" bind:value style="flex-grow: 1" {...attributes} />
<Datalist id={attributes.list} {config} />
