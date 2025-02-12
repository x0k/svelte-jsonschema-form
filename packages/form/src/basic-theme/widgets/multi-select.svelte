<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";

  declare module "../../form/index.js" {
    interface UiOptions {
      multiSelect?: HTMLSelectAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@/form/index.js";
  import { indexMapper, multipleOptions } from "@/options.svelte.js";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, handlers, config.uiOptions?.multiSelect)
  );

  const mapped = $derived(
    multipleOptions({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select multiple bind:value={mapped.value} style="flex-grow: 1" {...attributes}>
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
