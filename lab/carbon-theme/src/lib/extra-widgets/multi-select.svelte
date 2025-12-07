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
		errors
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarMultiCombo
	{options}
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
