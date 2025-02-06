<script lang="ts">
  import {
    singleOption,
    indexMapper,
    type WidgetProps,
    inputAttributes,
    getFormContext,
  } from "@/form/index.js";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: WidgetProps<"radio"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(inputAttributes(ctx, config, handlers));

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
