<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { CheckboxGroup as SvarCheckboxGroup } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarCheckboxes?: SvelteComponentProps<typeof SvarCheckboxGroup>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { idMapper, multipleOptions } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		options,
		config,
		handlers,
		mapped = multipleOptions({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['checkboxesWidget'] = $props();

	const ctx = getFormContext();

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarCheckboxGroup
	options={options.map((o) => ({ id: o.mappedValue ?? o.id, label: o.label }))}
	bind:value={mapped.current}
	{...uiOptionProps('svarCheckboxes')({ onchange }, config, ctx)}
/>
