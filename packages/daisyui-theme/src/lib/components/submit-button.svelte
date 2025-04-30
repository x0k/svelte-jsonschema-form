<script lang="ts">
	import { getFormContext, retrieveInputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/submit-button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'submitButton', () => ({ type: 'submit' }))
	);
</script>

<button class="btn btn-primary w-full" {...attributes}>
	{@render children()}
</button>
