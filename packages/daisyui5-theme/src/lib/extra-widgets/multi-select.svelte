<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { idMapper, multipleOptions } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/multi-select.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers,
		mapped = multipleOptions({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();
</script>

<select
	class={['select select-bordered w-full', errors.length > 0 && 'select-error']}
	bind:value={mapped.current}
	multiple
	{...selectAttributes(ctx, config, 'multiSelect', handlers, {})}
>
	{#each options as option (option.id)}
		<option value={option.mappedValue ?? option.id} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
