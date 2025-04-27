<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Checkbox?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import Checkbox from 'flowbite-svelte/Checkbox.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'flowbite3Checkbox', inputAttributes(handlers))
	);
</script>

<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes}
	>{config.title}</Checkbox
>
