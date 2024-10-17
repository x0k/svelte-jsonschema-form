<script lang="ts">
  import {
    multipleOptions,
    indexMapper,
    type WidgetProps,
  } from "@/form/index.js";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"checkboxes"> = $props();

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
