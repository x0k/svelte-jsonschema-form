<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/range.svelte';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.range,
			ctx.extraUiOptions?.('range', config)
		)
	);
</script>

<input
	type="range"
	bind:value={() => value ?? 0, (v) => (value = v)}
	class={['w-full range', errors.length > 0 && 'range-error']}
	{...attributes}
/>
