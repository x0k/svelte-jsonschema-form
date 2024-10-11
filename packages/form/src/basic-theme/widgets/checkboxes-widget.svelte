<script lang="ts">
  import { multipleOptions, indexMapper, type WidgetProps } from "@/form/index.js";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"checkboxes"> = $props();

	const guarder = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
		readonly: () => attributes.readonly
	});
</script>

{#each options as option, index (option.value)}
  <label>
    <input
      type="checkbox"
      bind:group={guarder.value}
      value={index}
      {...attributes}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
