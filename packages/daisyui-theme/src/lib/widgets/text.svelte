<script lang="ts">
	import {
		Datalist,
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/text.svelte';

	let { handlers, value = $bindable(), config, errors }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(retrieveAttributes(ctx, config, 'text', inputAttributes(handlers)));
</script>

<input
	type="text"
	bind:value
	class={['input input-bordered grow', errors.length > 0 && 'input-error']}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
