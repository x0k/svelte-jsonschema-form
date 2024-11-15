<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { multipleOptions, stringIndexMapper, type WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context'

	const ctx = getThemeContext();

	const { Checkbox, Label } = $derived(ctx.components)

	let { attributes, value = $bindable(), options }: WidgetProps<'checkboxes'> = $props();

	const mapped = multipleOptions({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const indexes = $derived(new Set(mapped.value));
</script>

{#each options as option, index (option.id)}
	{@const indexStr = index.toString()}
	<div class="flex items-center space-x-2">
		<Checkbox
			checked={indexes.has(indexStr)}
			value={indexStr}
			onCheckedChange={(v) => {
				mapped.value = v
					? mapped.value.concat(indexStr)
					: mapped.value.filter((index) => index !== indexStr);
			}}
			{...attributes as ComponentProps<typeof Checkbox>}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<Label for={option.id}>{option.label}</Label>
	</div>
{/each}
