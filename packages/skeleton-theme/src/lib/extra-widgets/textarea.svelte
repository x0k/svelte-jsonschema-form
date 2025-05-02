<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();
</script>

<textarea bind:value class="textarea" {...textareaAttributes(ctx, config, 'textarea', handlers, {})}
></textarea>
