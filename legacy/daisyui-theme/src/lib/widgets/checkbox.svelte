<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/checkbox.svelte';

	let {
		config,
		value = $bindable(),
		handlers,
		errors
	}: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();
</script>

<label class="label cursor-pointer gap-2">
	<input
		type="checkbox"
		class={['checkbox', errors.length > 0 && 'checkbox-error']}
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...inputAttributes(ctx, config, 'checkbox', handlers, {})}
	/>
	<span class="label-text">{config.title}</span>
</label>
