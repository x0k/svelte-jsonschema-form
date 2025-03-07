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
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
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

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyui5FilterItem)
	);
</script>

<div class="filter" {...config.uiOptions?.daisyui5Filter}>
	<input
		class="btn filter-reset"
		type="radio"
		bind:group={mapped.value}
		{...attributes}
		aria-label="Reset"
	/>
	{#each options as option, index (option.id)}
		<input
			type="radio"
			class={['btn', errors.length > 0 && 'btn-error']}
			bind:group={mapped.value}
			value={index}
			aria-label={option.label}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
	{/each}
</div>
