<script lang="ts">
	import { type WidgetProps, stringIndexMapper, singleOption } from '@sjsf/form';
	import type { ComponentProps } from 'svelte';

	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';

	let { attributes, value = $bindable(), options }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

<RadioGroup bind:value={mapped.value}>
	{#each options as option, index (option.id)}
		{@const indexStr = index.toString()}
		<div class="flex items-center space-x-2">
			<RadioGroupItem
				value={indexStr}
				{...attributes as Omit<ComponentProps<typeof RadioGroupItem>, 'value'>}
				id={option.id}
				disabled={option.disabled || attributes.disabled}
			/>
			<Label for={option.id}>{option.label}</Label>
		</div>
	{/each}
</RadioGroup>
