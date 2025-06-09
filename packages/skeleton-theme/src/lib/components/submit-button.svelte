<script lang="ts">
	import { buttonAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/submit-button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(buttonAttributes(ctx, config, 'submitButton', 'submit', {}));
</script>

<button class="btn preset-filled preset-filled-primary-500 w-full" {...attributes}>
	{@render children()}
</button>
