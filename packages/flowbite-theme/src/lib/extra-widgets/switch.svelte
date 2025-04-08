<script lang="ts" module>
	import { type ToggleProps } from 'flowbite-svelte/Toggle.svelte';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteSwitch?: ToggleProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Toggle from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteSwitch,
			ctx.extraUiOptions?.('flowbiteSwitch', config)
		)
	);
</script>

<Toggle bind:checked={() => value ?? false, (v) => (value = v)} {...attributes}>
	{config.title}
</Toggle>
