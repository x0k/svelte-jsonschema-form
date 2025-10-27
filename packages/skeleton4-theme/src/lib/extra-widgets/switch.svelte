<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import type { SwitchRootProps } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Switch?: SwitchRootProps;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, createId, type ComponentProps } from '@sjsf/form';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let { config, value = $bindable(), handlers, errors }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path));
</script>

<Switch
	{...customInputAttributes(ctx, config, 'skeleton4Switch', {
		ids: {
			hiddenInput: id
		},
		name: id,
		required: config.required,
		readOnly: config.schema.readOnly,
		invalid: errors.length > 0,
		onCheckedChange: (e) => {
			value = e.checked;
			handlers.oninput?.();
			handlers.onchange?.();
		},
		checked: value
	})}
>
	<Switch.Control>
		<Switch.Thumb />
	</Switch.Control>
	<Switch.Label>{config.title}</Switch.Label>
	<Switch.HiddenInput />
</Switch>
