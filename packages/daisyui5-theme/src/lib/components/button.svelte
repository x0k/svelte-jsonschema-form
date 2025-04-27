<script lang="ts">
	import {
		defineDisabled,
		getFormContext,
		retrieveNestedUiProps,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(
			ctx,
			retrieveNestedUiProps(
				ctx,
				config,
				'buttons',
				(p) => p[type],
				retrieveUiProps(ctx, config, 'button', {
					type: 'button',
					onclick,
					disabled
				})
			)
		)
	);
</script>

<button class="btn join-item btn-sm" {...attributes}>
	{@render children()}
</button>
