<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/checkbox.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.checkbox,
			ctx.extraUiOptions?.('checkbox', config)
		)
	);
</script>

<label class="flex items-center space-x-2 cursor-pointer">
	<input
		type="checkbox"
		class="checkbox"
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...attributes}
	/>
	<p>{config.title}</p>
</label>
