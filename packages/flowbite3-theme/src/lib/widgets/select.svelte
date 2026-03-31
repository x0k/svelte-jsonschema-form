<script lang="ts" module>
	import type { SelectProps } from 'flowbite-svelte/types';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Select?: SelectProps<number>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { singleOption, idMapper, EMPTY_VALUE } from '@sjsf/form/options.svelte';
	import Select from 'flowbite-svelte/Select.svelte';

	let {
		handlers,
		value = $bindable(),
		options,
		config,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		}),
		hasInitialValue = config.schema.default !== undefined
	}: ComponentProps['selectWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		selectAttributes(ctx, config, 'flowbite3Select', handlers, { placeholder: '' })
	);
</script>

<Select bind:value={mapped.current} class="flex-1" {...attributes}>
	{#if !hasInitialValue}
		<option value={EMPTY_VALUE}>{attributes.placeholder}</option>
	{/if}
	{#each options as option (option.id)}
		<option value={option.mappedValue ?? option.id} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</Select>
