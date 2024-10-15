<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Toggle, { type ToggleProps } from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();
</script>

<Toggle bind:checked={value} {...attributes as ToggleProps}>
	{config.title}
</Toggle>
