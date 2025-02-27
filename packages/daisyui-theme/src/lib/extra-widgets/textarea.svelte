<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/textarea.svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		textareaAttributes(ctx, config, handlers, config.uiOptions?.textarea)
	);
</script>

<textarea
	bind:value
	class={['textarea textarea-bordered grow', errors.length > 0 && 'textarea-error']}
	{...attributes}
></textarea>
