<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/number.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'number', handlers, { type: 'number' }));
</script>

<input {...attributes} bind:value={() => value ?? null, (v) => (value = v ?? undefined)} />
<Datalist id={attributes.list} {config} />
