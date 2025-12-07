<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/checkboxes.svelte';

	let {
		handlers,
		config,
		value = $bindable(),
		options,
		errors
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'checkboxes', handlers, {
			type: 'checkbox'
		})
	);
</script>

{#each options as option (option.id)}
	<label class="label cursor-pointer gap-2 justify-start">
		<input
			class={['checkbox', errors.length > 0 && 'checkbox-error']}
			bind:group={mapped.current}
			value={option.id}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
