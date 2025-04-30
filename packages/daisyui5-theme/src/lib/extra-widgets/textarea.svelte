<script lang="ts">
	import {
		getFormContext,
		retrieveInputAttributes,
		textareaAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/textarea.svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'textarea', textareaAttributes(handlers))
	);
</script>

<textarea
	bind:value
	class={['textarea textarea-bordered w-full', errors.length > 0 && 'textarea-error']}
	{...attributes}
></textarea>
