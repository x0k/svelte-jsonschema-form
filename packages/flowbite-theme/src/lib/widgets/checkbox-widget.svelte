<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Checkbox, { type CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();
</script>

<Checkbox bind:checked={value} {...attributes as CheckboxProps}>{config.title}</Checkbox>
