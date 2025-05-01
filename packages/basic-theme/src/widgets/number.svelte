<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      number?: HTMLInputAttributes;
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
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes("number", handlers)(
      {
        type: "number",
        style: "flex-grow: 1",
      },
      config,
      ctx
    )
  );
</script>

<input
  bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
  {...attributes}
/>
<Datalist id={attributes.list} {config} />
