<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/password-input.svelte';

	let {
		handlers,
		value = $bindable(),
		config,
		errors
	}: ComponentProps['passwordInputWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'passwordInput', handlers, { type: 'password' })
	);
</script>

<input
	bind:value
	class={['input input-bordered w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
