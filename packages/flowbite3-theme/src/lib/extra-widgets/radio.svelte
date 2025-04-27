<script lang="ts" module>
	import type { RadioProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/radio';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Radio?: RadioProps<number>;
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
		retrieveAttributes(ctx, config, 'flowbite3Radio', inputAttributes(handlers))
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
