<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import { TextFieldMultiline } from 'm3-svelte';

	let { value = $bindable(), attributes, errors, config }: WidgetProps<'textarea'> = $props();
</script>

<TextFieldMultiline
	name={config.name}
	bind:value
	error={errors.length > 0}
	extraOptions={attributes}
	extraWrapperOptions={{
		style: 'flex-grow: 1;'
	}}
/>
