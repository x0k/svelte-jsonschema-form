<script lang="ts">
	import { getFormContext, retrieveAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/submit-button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'submitButton', () => ({ type: 'submit' }))
	);
</script>

<button class="btn btn-primary w-full" {...attributes}>
	{@render children()}
</button>
