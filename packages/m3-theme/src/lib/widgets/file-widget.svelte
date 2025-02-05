<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import { TextField } from 'm3-svelte';

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable(),
		errors,
		config
	}: WidgetProps<'file'> = $props();
	const { disabled, ...rest } = $derived(attributes);
</script>

<TextField
	name={config.title}
	{disabled}
	error={errors.length > 0}
	extraOptions={{
		type: 'file',
		multiple,
		'data-loading': loading,
		'data-processing': processing,
		'bind:files': value,
		...rest,
		onchange: (e) => {
			value = e.currentTarget.files ?? undefined;
			rest.onchange?.(e);
		}
	}}
	extraWrapperOptions={{
		style: 'flex-grow: 1;'
	}}
/>
