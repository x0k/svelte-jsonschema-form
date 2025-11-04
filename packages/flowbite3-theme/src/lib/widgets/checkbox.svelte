<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte/types';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Checkbox?: CheckboxProps;
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
	{...inputAttributes(ctx, config, 'flowbite3Checkbox', handlers, {})}>{config.title}</Checkbox
>
