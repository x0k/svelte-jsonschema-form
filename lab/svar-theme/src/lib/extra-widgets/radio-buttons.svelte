<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Segmented } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarRadioButtons?: SvelteComponentProps<typeof Segmented>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		handlers
	}: ComponentProps['radioButtonsWidget'] = $props();

	const ctx = getFormContext();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<Segmented
	{options}
	bind:value={mapped.current}
	{...uiOptionProps('svarRadioButtons')(
		{
			onchange
		},
		config,
		ctx
	)}
/>
