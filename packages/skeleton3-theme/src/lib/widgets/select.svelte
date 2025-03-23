<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/widgets/select.svelte';

	let { value = $bindable(), options, config, handlers }: ComponentProps['selectWidget'] = $props();

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

<select class="select" bind:value={mapped.value} {...attributes}>
	{#if config.schema.default === undefined}
		<option value={-1}>{attributes.placeholder}</option>
	{/if}
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
