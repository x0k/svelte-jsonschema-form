<script lang="ts" module>
	import type { InputProps, InputValue } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Number?: InputProps<number | undefined>;
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'flowbite3Number', handlers, {
			type: 'number',
			wrapperClass: 'w-full',
			onBlur: handlers.onblur,
			onInput: handlers.oninput,
		})
	);
</script>

<!-- NOTE: value getter should be `() => value ?? null` but types are incorrect -->
<Input
	type="number"
	bind:value={() => value, (v) => (value = v ?? undefined)}
	{...attributes as InputProps<InputValue>}
/>
<Datalist id={attributes.list} {config} />
