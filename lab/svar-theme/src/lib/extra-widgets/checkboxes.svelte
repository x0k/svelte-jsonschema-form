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
		handlers
	}: ComponentProps['checkboxesWidget'] = $props();

	const ctx = getFormContext();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarCheckboxGroup
	{options}
	bind:value={mapped.value}
	{...uiOptionProps('svarCheckboxes')({ onchange }, config, ctx)}
/>
