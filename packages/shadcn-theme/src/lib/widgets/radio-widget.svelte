<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';

	let { attributes, value = $bindable(), options }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

{#each options as option, index (option.id)}
	<label class="flex items-center space-x-2 cursor-pointer">
		<input
			type="radio"
			class="radio"
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<p>{option.label}</p>
	</label>
{/each}
