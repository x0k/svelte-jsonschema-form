<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/range.svelte';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(retrieveAttributes(ctx, config, 'range', inputAttributes(handlers)));
</script>

<input
	type="range"
	bind:value={() => value ?? 0, (v) => (value = v)}
	class={['range grow', errors.length > 0 && 'range-error']}
	{...attributes}
/>
