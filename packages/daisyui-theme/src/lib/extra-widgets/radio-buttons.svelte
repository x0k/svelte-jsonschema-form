<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyuiRadioButtons?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options,
		errors
	}: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyuiRadioButtons)
	);
</script>

<div class="join">
	{#each options as option, index (option.id)}
		<input
			type="radio"
			class={['join-item btn', errors.length > 0 && 'btn-error']}
			bind:group={mapped.value}
			value={index}
			aria-label={option.label}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
	{/each}
</div>
