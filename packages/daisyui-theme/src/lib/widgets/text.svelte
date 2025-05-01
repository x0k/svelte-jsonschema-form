<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/text.svelte';

	let { handlers, value = $bindable(), config, errors }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes('text', handlers)(
			{
				type: 'text'
			},
			config,
			ctx
		)
	);
</script>

<input
	bind:value
	class={['input input-bordered grow', errors.length > 0 && 'input-error']}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
