<script lang="ts" module>
	import type { InputProps } from 'flowbite-svelte/Input.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteText?: InputProps;
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Input from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteText,
			ctx.extraUiOptions?.('flowbiteText', config)
		)
	);
</script>

<Input type="text" bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
