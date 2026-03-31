<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { singleOption, idMapper, EMPTY_VALUE } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/widgets/select.svelte';

	let {
		value = $bindable(),
		options,
		config,
		handlers,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		}),
		hasInitialValue = config.schema.default !== undefined
	}: ComponentProps['selectWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(selectAttributes(ctx, config, 'select', handlers, {}));
</script>

<select {...attributes} bind:value={mapped.current}>
	{#if hasInitialValue}
		<option value={EMPTY_VALUE}>{attributes.placeholder}</option>
	{/if}
	{#each options as option (option.id)}
		<option value={option.mappedValue ?? option.id} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
