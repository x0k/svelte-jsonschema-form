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
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';
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
		retrieveAttributes(ctx, config, 'daisyui5FilterItem', inputAttributes(handlers))
	);
</script>

<div class="filter" {...retrieveUiProps(ctx, config, 'daisyui5Filter', {})}>
	<input
		class="btn filter-reset"
		type="radio"
		bind:group={mapped.value}
		{...itemAttributes}
		aria-label="Reset"
	/>
	{#each options as option, index (option.id)}
		<input
			type="radio"
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
