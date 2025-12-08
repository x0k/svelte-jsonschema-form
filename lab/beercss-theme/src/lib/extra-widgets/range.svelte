<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/range.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();
</script>

<div class="slider">
	<input
		{...inputAttributes(ctx, config, 'range', handlers, { type: 'range' })}
		bind:value={() => value ?? 0, (v) => (value = v)}
	/>
	<span></span>
</div>
