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
  import { singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
    mapper,
    mapped = singleOption({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "radio", handlers, {
      type: "radio",
    })
  );
</script>

{#each options as option (option.id)}
  <label class="sjsf-radio">
    <input
      bind:group={mapped.current}
      value={option.mappedValue}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
