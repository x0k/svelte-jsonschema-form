<script lang="ts" module>
	import type { InputProps, InputValue } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Text?: InputProps<string | undefined>;
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'flowbite3Text', handlers, {
			type: 'text',
			wrapperClass: 'w-full'
		})
	);
</script>

<Input bind:value {...attributes as InputProps<InputValue>} />
<Datalist id={attributes.list} {config} />
