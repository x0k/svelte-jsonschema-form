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
</script>

<textarea
	bind:value
	class={['textarea textarea-bordered w-full', errors.length > 0 && 'textarea-error']}
	{...textareaAttributes(ctx, config, 'textarea', handlers, {})}
></textarea>
