<script lang="ts">
	import { multipleOptions, type WidgetProps } from '@sjsf/form';
	import Checkbox, { type CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';

	let { attributes, value = $bindable(), options }: WidgetProps<'checkboxes'> = $props();

	const checkboxProps = $derived(attributes as CheckboxProps);

	const guarder = multipleOptions({
		options: () => options,
		value: () => value,
		update: (v) => (value = v),
		readonly: () => attributes.readonly
	});

	const choices = $derived(
		options.map((option, i) => ({
			value: i,
			label: option.label
		}))
	);
</script>

<Checkbox {choices} bind:group={guarder.value} groupInputClass='ms-2' {...checkboxProps} />
