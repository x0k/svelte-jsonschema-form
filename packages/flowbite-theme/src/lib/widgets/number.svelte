<script lang="ts" module>
	import type { NumberInputProps } from 'flowbite-svelte/NumberInput.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteNumber?: NumberInputProps;
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import NumberInput from 'flowbite-svelte/NumberInput.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteNumber,
			ctx.extraUiOptions?.('flowbiteNumber', config)
		)
	);
</script>

<NumberInput bind:value={() => value ?? null, (v) => (value = v ?? undefined)} {...attributes} />
<Datalist id={attributes.list} {config} />
