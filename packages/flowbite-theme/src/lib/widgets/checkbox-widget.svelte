<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Checkbox, { type CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();

	const checkboxProps = $derived(attributes as CheckboxProps);
</script>

<Checkbox bind:checked={value} {...checkboxProps}>{config.title}</Checkbox>
