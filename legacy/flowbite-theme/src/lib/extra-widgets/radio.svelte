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
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import Radio from 'flowbite-svelte/Radio.svelte';

	let { value = $bindable(), options, config, handlers }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'flowbiteRadio', handlers, {}));
</script>

{#each options as option (option.id)}
	<Radio
		bind:group={mapped.current}
		value={option.id}
		{...attributes}
		id={option.id}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Radio>
{/each}
