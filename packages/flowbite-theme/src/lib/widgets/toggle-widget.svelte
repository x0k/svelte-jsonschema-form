<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Toggle, { type ToggleProps } from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();

	const toggleProps = $derived(attributes as ToggleProps);
</script>

<Toggle bind:checked={value} {...toggleProps}>
	{config.title}
</Toggle>
