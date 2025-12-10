<script lang="ts">
	import { buttonAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/submit-button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
</script>

<button
	{...buttonAttributes(ctx, config, 'submitButton', 'submit', {
		class: 'responsive'
	})}
>
	{@render children()}
</button>
