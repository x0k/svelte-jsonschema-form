<script lang="ts" module>
	import type { InputProps, InputValue } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/color-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3ColorPicker?: InputProps<string | undefined>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['colorPickerWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'flowbite3ColorPicker', handlers, {
			type: 'color',
			onBlur: handlers.onblur,
			onInput: handlers.oninput,
      class: 'h-14'
		})
	);
</script>

<Input bind:value {...attributes as InputProps<InputValue>} />
