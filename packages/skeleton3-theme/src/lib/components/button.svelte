<script lang="ts">
	import {
		defineDisabled,
		getFormContext,
		retrieveNestedUiProps,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	const { children, onclick, config, disabled, type }: ComponentProps['button'] = $props();

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
					disabled,
					onclick
				})
			)
		)
	);
</script>

<button class="btn preset-filled" {...attributes}>
	{@render children()}
</button>
