<script lang="ts" module>
	import type { InputProps, InputValue } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/password-input';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3PasswordInput?: InputProps<string | undefined>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['passwordInputWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'flowbite3PasswordInput', handlers, {
			type: 'password',
			onBlur: handlers.onblur,
			onInput: handlers.oninput
		})
	);
</script>

<Input bind:value {...attributes as InputProps<InputValue>} />
