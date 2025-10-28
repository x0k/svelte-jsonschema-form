<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/text.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'text', handlers, { type: 'text' }));
</script>

<input bind:value class="input" {...attributes} />
<Datalist id={attributes.list} {config} />
