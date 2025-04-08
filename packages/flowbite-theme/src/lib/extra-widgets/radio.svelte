<script lang="ts" module>
	import type { RadioProps } from 'flowbite-svelte/Radio.svelte';
	import '@sjsf/form/fields/extra-widgets/radio';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteRadio?: RadioProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';
	import Radio from 'flowbite-svelte/Radio.svelte';

	let { value = $bindable(), options, config, handlers }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteRadio,
			ctx.extraUiOptions?.('flowbiteRadio', config)
		)
	);
</script>

{#each options as option, index (option.id)}
	<Radio
		bind:group={mapped.value}
		value={index}
		{...attributes}
		id={option.id}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Radio>
{/each}
