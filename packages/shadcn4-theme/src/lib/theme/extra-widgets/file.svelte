<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/file.svelte';

	import { getThemeContext } from '../context.js';
	import '../types/input';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: ComponentProps['fileWidget'] = $props();
</script>

<Input
	{...inputAttributes(ctx, config, 'file', handlers, {
		multiple,
		'data-loading': loading,
		'data-processing': processing
	})}
	bind:files={value}
	type="file"
/>
