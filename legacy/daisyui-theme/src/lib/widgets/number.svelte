<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/number.svelte';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'number', handlers, {
			type: 'number'
		})
	);
</script>

<input
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	class={['input input-bordered grow', errors.length > 0 && 'input-error']}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
