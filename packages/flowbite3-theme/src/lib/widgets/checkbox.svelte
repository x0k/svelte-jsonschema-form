<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteCheckbox?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Checkbox from 'flowbite-svelte/Checkbox.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.flowbiteCheckbox, ctx.extraUiOptions?.('flowbiteCheckbox', config))
	);
</script>

<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes}
	>{config.title}</Checkbox
>
