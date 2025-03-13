<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	const { children, type, config, disabled, onclick }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
	const attributes = $derived(
		defineDisabled(ctx, {
			disabled,
			...config.uiOptions?.button,
			...config.uiOptions?.buttons?.[type]
		})
	);
</script>

<button class="btn join-item btn-sm" type="button" {onclick} {...attributes}>
	{@render children()}
</button>
