<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.text));
</script>

<input type="text" bind:value class="input" {...attributes} />
<Datalist id={attributes.list} {config} />
