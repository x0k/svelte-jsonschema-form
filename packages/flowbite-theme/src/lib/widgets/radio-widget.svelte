<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';
	import Radio, { type RadioProps } from 'flowbite-svelte/Radio.svelte';

	let { attributes, value = $bindable(), options }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

{#each options as option, index (option.value)}
	<Radio
		bind:group={mapped.value}
		value={index}
		{...attributes as RadioProps}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Radio>
{/each}
