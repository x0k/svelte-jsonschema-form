<script lang="ts" module>
	import type { RadioProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/radio';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Radio?: RadioProps<number>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import Radio from 'flowbite-svelte/Radio.svelte';

	let { value = $bindable(), options, config, handlers }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'flowbite3Radio', handlers, {}));
</script>

{#each options as option (option.id)}
	<Radio
		bind:group={mapped.value}
		value={option.id}
		{...attributes}
		id={option.id}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Radio>
{/each}
