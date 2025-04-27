<script lang="ts">
	import {
		getFormContext,
		retrieveAttributes,
		textareaAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'textarea', textareaAttributes(handlers))
	);
</script>

<textarea bind:value class="textarea" {...attributes}></textarea>
