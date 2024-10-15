<script lang="ts">
  import { indexMapper, multipleOptions, singleOption, type WidgetProps } from "@/form/index.js";

  let {
    attributes,
    value = $bindable(),
    options,
    multiple,
    config,
  }: WidgetProps<"select"> = $props();
  
	const mapped = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => indexMapper(options),
      // @ts-expect-error
			value: () => value,
			update: (v) => (value = v),
		})
	);
</script>

{#snippet children()}
  {#if !multiple && config.schema.default === undefined}
    <option value={-1}>{attributes.placeholder}</option>
  {/if}
  {#each options as option, index (option.value)}
    <option value={index} disabled={option.disabled} >
      {option.label}
    </option>
  {/each}
{/snippet}
{#if multiple}
  <select
    multiple
    bind:value={mapped.value}
    style="flex-grow: 1"
    {...attributes}
  >
    {@render children()}
  </select>
{:else}
  <select
    bind:value={mapped.value}
    style="flex-grow: 1"
    {...attributes}
  >
    {@render children()}
  </select>
{/if}
