<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/number.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.number,
			ctx.extraUiOptions?.('number', config)
		)
	);
</script>

<input
	type="number"
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	class="input"
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
