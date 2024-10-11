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

	const { readonly, placeholder, ...rest } = $derived(attributes);

	const guarded = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => indexMapper(options),
			// @ts-expect-error
			value: () => value,
			update: (v) => (value = v),
			readonly: () => readonly
		})
	);
</script>

{#if multiple}
	{@const selectOptions = options.map((option, i) => ({
		value: i,
		name: option.label,
		disabled: option.disabled
	}))}
	{@const multiSelectProps = rest as MultiSelectProps}
	<MultiSelect
		class="grow"
		bind:value={guarded.value as number[]}
		items={selectOptions}
		placeholder={placeholder ?? undefined}
		{...multiSelectProps}
	/>
{:else}
	{@const selectProps = rest as SelectProps}
	<Select bind:value={guarded.value as number} placeholder="" {...selectProps}>
		{#if config.schema.default === undefined}
			<option value={-1}>{placeholder}</option>
		{/if}
		{#each options as option, index (option.value)}
			<option value={index} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</Select>
{/if}
