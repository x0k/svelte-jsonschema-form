<script lang="ts" module>
	import type { ToggleProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Switch?: ToggleProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Toggle from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();
</script>

<Toggle
	bind:checked={() => value ?? false, (v) => (value = v)}
	{...inputAttributes(ctx, config, 'flowbite3Switch', handlers, {})}
>
	{config.title}
</Toggle>
