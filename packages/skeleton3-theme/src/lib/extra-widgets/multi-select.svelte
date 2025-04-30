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
		handlers
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'multiSelect', selectAttributes(handlers))
	);

	const mapped = $derived(
		multipleOptions({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);
</script>

<select multiple bind:value={mapped.value} class="select" {...attributes}>
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
