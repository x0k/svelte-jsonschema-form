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
	import { on } from 'svelte/events';
	import { getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		handlers,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['radioButtonsWidget'] = $props();

	const ctx = getFormContext();

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<div {@attach (n) => on(n, 'click', (e) => e.preventDefault())}>
	<Segmented
		options={options.map((o) => ({ id: o.mappedValue ?? o.id, label: o.label }))}
		bind:value={mapped.current}
		{...uiOptionProps('svarRadioButtons')(
			{
				onchange
			},
			config,
			ctx
		)}
	/>
</div>
