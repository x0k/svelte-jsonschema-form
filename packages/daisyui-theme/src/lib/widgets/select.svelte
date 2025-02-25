<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { singleOption, indexMapper } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers
	}: ComponentProps['selectWidget'] = $props();

	const mapped = $derived(
		singleOption({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const ctx = getFormContext();

	const attributes = $derived(selectAttributes(ctx, config, handlers, config.uiOptions?.select));
</script>

{#snippet children()}
	{#if config.schema.default === undefined}
		<option value={-1}>{attributes.placeholder}</option>
	{/if}
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
{/snippet}
<select
	class={['select select-bordered grow', errors.length > 0 && 'select-error']}
	bind:value={mapped.value}
	{...attributes}
>
	{@render children()}
</select>
