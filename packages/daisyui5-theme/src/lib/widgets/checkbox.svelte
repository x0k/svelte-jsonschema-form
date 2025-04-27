<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/widgets/checkbox.svelte';

	let {
		config,
		value = $bindable(),
		handlers,
		errors
	}: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'checkbox', inputAttributes(handlers))
	);
</script>

<label class="fieldset-label">
	<input
		type="checkbox"
		class={['checkbox', errors.length > 0 && 'checkbox-error']}
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...attributes}
	/>
	{config.title}
</label>
