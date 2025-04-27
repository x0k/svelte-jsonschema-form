<script lang="ts" module>
	import type { InputProps, InputValue } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Text?: InputProps<string | undefined>;
		}
	}
</script>

<script lang="ts">
	import {
		Datalist,
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'flowbite3Text', inputAttributes(handlers))
	);
</script>

<Input type="text" bind:value {...attributes as InputProps<InputValue>} />
<Datalist id={attributes.list} {config} />
