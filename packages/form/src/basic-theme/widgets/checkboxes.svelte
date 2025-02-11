<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      checkboxes?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@/form/index.js";
  import { indexMapper, multipleOptions } from "@/options.svelte.js";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: ComponentProps["checkboxesWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.checkboxes)
  );

  const mapped = multipleOptions({
    mapper: () => indexMapper(options),
    value: () => value,
    update: (v) => (value = v),
  });
</script>

{#each options as option, index (option.id)}
  <label>
    <input
      type="checkbox"
      bind:group={mapped.value}
      value={index}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
