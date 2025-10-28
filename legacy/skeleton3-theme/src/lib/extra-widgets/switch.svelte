<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Switch as SkeletonSwitch } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Switch?: SvelteComponentProps<typeof SkeletonSwitch>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		createId,
		type ComponentProps
	} from '@sjsf/form';

	let { config, value = $bindable(), handlers, errors }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path));
</script>

<SkeletonSwitch
	{...customInputAttributes(ctx, config, 'skeleton3Switch', {
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
	{config.title}
</SkeletonSwitch>
