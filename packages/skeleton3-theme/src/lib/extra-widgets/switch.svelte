<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Switch?: SvelteComponentProps<typeof Switch>;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	let { config, value = $bindable(), handlers, errors }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const attributes: SvelteComponentProps<typeof Switch> = $derived(
		defineDisabled(ctx, {
			ids: {
				hiddenInput: config.id
			},
			name: config.name,
			required: config.required,
			readOnly: config.schema.readOnly,
			invalid: errors.length > 0,
			onCheckedChange: (e) => {
				value = e.checked;
				handlers.onchange?.();
			},
			...config.uiOptions?.skeleton3Switch,
			...ctx.extraUiOptions?.('skeleton3Switch', config)
		})
	);
</script>

<Switch checked={value} {...attributes}>
	{config.title}
</Switch>
