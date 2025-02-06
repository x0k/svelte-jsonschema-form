<script lang="ts">
  import {
    multipleOptions,
    indexMapper,
    type WidgetProps,
    getFormContext,
    inputAttributes,
  } from "@/form/index.js";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: WidgetProps<"checkboxes"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(inputAttributes(ctx, config, handlers));

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
