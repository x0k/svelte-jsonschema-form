<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/range.svelte';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	bind:value={() => value ?? 0, (v) => (value = v)}
	class={['range grow', errors.length > 0 && 'range-error']}
	{...inputAttributes('range', handlers)({ type: 'range' }, config, ctx)}
/>
