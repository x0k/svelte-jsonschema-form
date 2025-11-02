<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/radio";

  declare module "@sjsf/form" {
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
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "radio", handlers, {
      type: "radio",
    })
  );

  const mapped = singleOption({
    mapper: () => idMapper(options),
    value: () => value,
    update: (v) => (value = v),
  });
</script>

{#each options as option (option.id)}
  <label>
    <input
      bind:group={mapped.value}
      value={option.id}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}

<style>
  label {
    display: flex;
    align-items: start;
    gap: 0.2rem;
  }
</style>
