<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/text.svelte';

	let { handlers, value = $bindable(), config, errors }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'text', handlers, { type: 'text' }));
</script>

<input
	bind:value
	class={['input input-bordered w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
