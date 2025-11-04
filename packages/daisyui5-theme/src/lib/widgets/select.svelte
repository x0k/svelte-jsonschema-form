<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { singleOption, idMapper, UNDEFINED_ID } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/widgets/select.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers
	}: ComponentProps['selectWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(selectAttributes(ctx, config, 'select', handlers, {}));
</script>

<select
	class={['select select-bordered w-full', errors.length > 0 && 'select-error']}
	bind:value={mapped.value}
	{...attributes}
>
	{#if config.schema.default === undefined}
		<option value={UNDEFINED_ID}>{attributes.placeholder}</option>
	{/if}
	{#each options as option (option.id)}
		<option value={option.id} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
