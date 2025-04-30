<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveInputAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/file.svelte';

	import { getThemeContext } from '../context';
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

	const attributes = $derived(retrieveInputAttributes(ctx, config, 'file', inputAttributes(handlers)));
</script>

<Input
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
	bind:files={value}
	type="file"
/>
