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
    retrieveInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    retrieveInputAttributes(ctx, config, "number", inputAttributes(handlers))
  );
</script>

<input
  type="number"
  bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
  style="flex-grow: 1"
  {...attributes}
/>
<Datalist id={attributes.list} {config} />
