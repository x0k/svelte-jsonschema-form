<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteCheckboxes?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import Checkbox from 'flowbite-svelte/Checkbox.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const choices = $derived(
		options.map((option) => ({
			value: option.id,
			label: option.label
		}))
	);

	const ctx = getFormContext();
</script>

<Checkbox
	bind:group={mapped.current}
	groupInputClass="ms-2"
	{...inputAttributes(ctx, config, 'flowbiteCheckboxes', handlers, { choices })}
/>
