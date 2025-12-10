<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/checkbox.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();
</script>

<label class="checkbox">
	<input
		type="checkbox"
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...inputAttributes(ctx, config, 'checkbox', handlers, {})}
	/>
	<span>{config.title}</span>
</label>
