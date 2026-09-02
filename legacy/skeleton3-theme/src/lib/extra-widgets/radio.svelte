<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/extra-widgets/radio.svelte";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapper,
  }: ComponentProps["radioWidget"] = $props();

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "radio", handlers, { type: "radio" })
  );
</script>

{#each options as option (option.id)}
  <label class="flex cursor-pointer items-center space-x-2">
    <input
      class="radio"
      bind:group={mapped.current}
      value={option.mappedValue}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    <p>{option.label}</p>
  </label>
{/each}
