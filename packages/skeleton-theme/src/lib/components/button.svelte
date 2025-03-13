<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	const { children, onclick, config, disabled, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(ctx, {
			disabled,
			...config.uiOptions?.button,
			...config.uiOptions?.buttons?.[type]
		})
	);
</script>

<button class="btn preset-filled" type="button" {onclick} {...attributes}>
	{@render children()}
</button>
