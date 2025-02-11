<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      radio?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    inputAttributes,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";
  import { indexMapper, singleOption } from "@/options.svelte.js";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, handlers, config.uiOptions?.radio)
  );

  const mapped = singleOption({
    mapper: () => indexMapper(options),
    value: () => value,
    update: (v) => (value = v),
  });
</script>

{#each options as option, index (option.id)}
  <label>
    <input
      bind:group={mapped.value}
      value={index}
      {...attributes}
      type="radio"
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
