<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/checkboxes.svelte';

	let {
		handlers,
		value = $bindable(),
		options,
		config,
		mapped = multipleOptions({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['checkboxesWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'checkboxes', handlers, { type: 'checkbox' })
	);
</script>

{#each options as option (option.id)}
	<label class="flex cursor-pointer items-center space-x-2">
		<input
			class="checkbox"
			bind:group={mapped.current}
			value={option.mappedValue ?? option.id}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<p>{option.label}</p>
	</label>
{/each}
