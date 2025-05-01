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
    inputAttributes("text", handlers)(
      {
        style: "flex-grow: 1",
        type: "text",
      },
      config,
      ctx
    )
  );
</script>

<input bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
