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
	import {
		getFormContext,
		inputAttributes,
		retrieveInputAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import Toggle from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbiteSwitch', inputAttributes(handlers))
	);
</script>

<Toggle bind:checked={() => value ?? false, (v) => (value = v)} {...attributes}>
	{config.title}
</Toggle>
