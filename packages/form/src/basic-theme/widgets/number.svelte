<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "../../form/index.js" {
    interface UiOptions {
      number?: HTMLInputAttributes;
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
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.number)
  );
</script>

<input type="number" bind:value style="flex-grow: 1" {...attributes} />
