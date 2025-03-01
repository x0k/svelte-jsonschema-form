<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/legacy-fields/extra-widgets/range';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.number));
</script>

<input
	type="range"
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	class={['range grow', errors.length > 0 && 'range-error']}
	{...attributes}
/>
