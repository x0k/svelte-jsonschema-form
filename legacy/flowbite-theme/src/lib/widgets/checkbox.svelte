<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';

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
</script>

<Checkbox
	bind:checked={() => value ?? false, (v) => (value = v)}
	{...inputAttributes(ctx, config, 'flowbiteCheckbox', handlers, {})}>{config.title}</Checkbox
>
