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
    inputAttributes(
      ctx,
      config,
      handlers,
      config.uiOptions?.number,
      ctx.extraUiOptions?.("number", config)
    )
  );
</script>

<input
  type="number"
  bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
  style="flex-grow: 1"
  {...attributes}
/>
<Datalist id={attributes.list} {config} />
