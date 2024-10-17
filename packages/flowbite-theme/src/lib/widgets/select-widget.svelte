<script lang="ts">
	import { singleOption, multipleOptions, type WidgetProps, indexMapper } from '@sjsf/form';
	import Select, { type SelectProps } from 'flowbite-svelte/Select.svelte';
	import MultiSelect, { type MultiSelectProps } from 'flowbite-svelte/MultiSelect.svelte';

	let {
		attributes,
		value = $bindable(),
		options,
		multiple,
		config
	}: WidgetProps<'select'> = $props();

	const { placeholder, ...rest } = $derived(attributes);

	const mapped = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => indexMapper(options),
			// @ts-expect-error
			value: () => value,
			update: (v) => (value = v)
		})
	);
</script>

{#if multiple}
	{@const selectOptions = options.map((option, i) => ({
		value: i,
		name: option.label,
		disabled: option.disabled
	}))}
	<MultiSelect
		class="grow"
		bind:value={mapped.value as number[]}
		items={selectOptions}
		placeholder={placeholder ?? undefined}
		{...rest as MultiSelectProps}
	/>
{:else}
	<Select bind:value={mapped.value as number} placeholder="" {...rest as SelectProps}>
		{#if config.schema.default === undefined}
			<option value={-1}>{placeholder}</option>
		{/if}
		{#each options as option, index (option.id)}
			<option value={index} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</Select>
{/if}
