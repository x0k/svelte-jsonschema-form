<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.number));
</script>

<input
	type="number"
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	class={attributes.type === 'range' ? 'range grow w-0' : 'input'}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
