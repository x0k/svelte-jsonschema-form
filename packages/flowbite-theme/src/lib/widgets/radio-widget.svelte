<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';
	import Radio, { type RadioProps } from 'flowbite-svelte/Radio.svelte'

	let { attributes, value = $bindable(), options }: WidgetProps<'radio'> = $props();

	const radioProps = $derived(attributes as RadioProps);

	const guarder = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
		readonly: () => attributes.readonly
	});
</script>

{#each options as option, index (option.value)}
	<Radio
		bind:group={guarder.value}
		value={index}
		{...radioProps}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Radio>
{/each}
