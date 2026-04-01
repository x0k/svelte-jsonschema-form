<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { RadioButtonGroup as SvarRadioButtonGroup } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/radio';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarRadio?: SvelteComponentProps<typeof SvarRadioButtonGroup>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';

	let {
		handlers,
		config,
		value = $bindable(),
		options,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['radioWidget'] = $props();

	const ctx = getFormContext();

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarRadioButtonGroup
	options={options.map((o) => ({ id: o.mappedValue ?? o.id, label: o.label }))}
	bind:value={mapped.current}
	{...uiOptionProps('svarRadio')(
		{
			onchange
		},
		config,
		ctx
	)}
/>
