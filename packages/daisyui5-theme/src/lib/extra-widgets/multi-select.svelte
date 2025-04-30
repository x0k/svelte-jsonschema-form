<script lang="ts">
	import {
		getFormContext,
		retrieveInputAttributes,
		selectAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import { indexMapper, multipleOptions } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/multi-select.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers
	}: ComponentProps['multiSelectWidget'] = $props();

	const mapped = $derived(
		multipleOptions({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);
	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'multiSelect', selectAttributes(handlers))
	);
</script>

<select
	class={['select select-bordered w-full', errors.length > 0 && 'select-error']}
	bind:value={mapped.value}
	multiple
	{...attributes}
>
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
