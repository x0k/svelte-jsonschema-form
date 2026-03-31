<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { MultiCombo as SvarMultiCombo } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/multi-select';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarMultiSelect?: SvelteComponentProps<typeof SvarMultiCombo>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		getId,
		isDisabled,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { idMapper, multipleOptions } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		handlers,
		errors,
		mapped = multipleOptions({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarMultiCombo
	options={options.map((o) => ({ id: o.mappedValue ?? o.id, label: o.label }))}
	bind:value={mapped.current}
	{...uiOptionProps('svarMultiSelect')(
		{
			id,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			checkboxes: true,
			onchange
		},
		config,
		ctx
	)}
/>
