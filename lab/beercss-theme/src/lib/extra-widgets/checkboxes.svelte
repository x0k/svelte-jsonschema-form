<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssCheckboxesContainer?: HTMLAttributes<HTMLElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/checkboxes.svelte';

	let {
		handlers,
		config,
		value = $bindable(),
		options,
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

<nav {...uiOptionProps('beercssCheckboxesContainer')({}, config, ctx)}>
	{#each options as option (option.id)}
		<label class="checkbox">
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
