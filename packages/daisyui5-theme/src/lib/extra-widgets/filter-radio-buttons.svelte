<script lang="ts" module>
	import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5Filter?: HTMLAttributes<HTMLDivElement>;
			daisyui5FilterItem?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { singleOption, indexMapper } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers
	}: ComponentProps['radioButtonsWidget'] = $props();

	const mapped = $derived(
		singleOption({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const ctx = getFormContext();

	const itemAttributes = $derived(
		inputAttributes(ctx, config, 'daisyui5FilterItem', handlers, {
			type: 'radio'
		})
	);
</script>

<div class="filter" {...uiOptionProps('daisyui5Filter')({}, config, ctx)}>
	<input
		class="btn filter-reset"
		bind:group={mapped.value}
		{...itemAttributes}
		aria-label="Reset"
	/>
	{#each options as option, index (option.id)}
		<input
			class={['btn', errors.length > 0 && 'btn-error']}
			bind:group={mapped.value}
			value={index}
			aria-label={option.label}
			{...itemAttributes}
			id={option.id}
			disabled={option.disabled || itemAttributes.disabled}
		/>
	{/each}
</div>
