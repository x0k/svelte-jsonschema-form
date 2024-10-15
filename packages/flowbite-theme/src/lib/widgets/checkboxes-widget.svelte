<script lang="ts">
	import { multipleOptions, stringIndexMapper, type WidgetProps } from '@sjsf/form';
	import Checkbox, { type CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';

	let { attributes, value = $bindable(), options }: WidgetProps<'checkboxes'> = $props();

	const mapped = multipleOptions({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const choices = $derived(
		options.map((option, i) => ({
			value: String(i),
			label: option.label
		}))
	);
</script>

<Checkbox
	{choices}
	bind:group={mapped.value}
	groupInputClass="ms-2"
	{...attributes as CheckboxProps}
/>
