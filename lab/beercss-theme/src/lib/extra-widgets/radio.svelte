<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssRadioContainer?: HTMLAttributes<HTMLElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/radio.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['radioWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'radio', handlers, { type: 'radio' }));
</script>

<nav {...uiOptionProps('beercssRadioContainer')({}, config, ctx)}>
	{#each options as option (option.id)}
		<label class="radio">
			<input
				{...attributes}
				bind:group={mapped.current}
				value={option.mappedValue ?? option.id}
				id={option.id}
				disabled={option.disabled || attributes.disabled}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
</nav>
