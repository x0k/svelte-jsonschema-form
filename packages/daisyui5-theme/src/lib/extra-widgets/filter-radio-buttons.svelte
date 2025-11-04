<script lang="ts" module>
	import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
	import type { SchemaValue } from '@sjsf/form';
	import type { Options, WidgetCommonProps } from '@sjsf/form/fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			daisyui5FilterRadioButtonsWidget: WidgetCommonProps<SchemaValue> & Options;
		}
		interface ComponentBindings {
			daisyui5FilterRadioButtonsWidget: 'value';
		}
		interface UiOptions {
			daisyui5Filter?: HTMLAttributes<HTMLDivElement>;
			daisyui5FilterItem?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { singleOption, idMapper } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		errors,
		handlers
	}: ComponentProps['daisyui5FilterRadioButtonsWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

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
	{#each options as option (option.id)}
		<input
			class={['btn', errors.length > 0 && 'btn-error']}
			bind:group={mapped.value}
			value={option.id}
			aria-label={option.label}
			{...itemAttributes}
			id={option.id}
			disabled={option.disabled || itemAttributes.disabled}
		/>
	{/each}
</div>
