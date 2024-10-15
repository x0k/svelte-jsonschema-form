<script lang="ts">
	import { multipleOptions, indexMapper, type WidgetProps } from '@sjsf/form';

	let { attributes, value = $bindable(), options }: WidgetProps<'checkboxes'> = $props();

	const mapped = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
	});
</script>

{#each options as option, index (option.value)}
	<label class="flex items-center space-x-2 cursor-pointer">
		<input
			type="checkbox"
			class="checkbox"
			bind:group={mapped.value}
			value={index}
			{...attributes}
			disabled={option.disabled || attributes.disabled}
		/>
		<p>{option.label}</p>
	</label>
{/each}
