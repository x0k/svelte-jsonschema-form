<script lang="ts">
	import { multipleOptions, indexMapper, type WidgetProps } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'checkboxes'> = $props();

	const mapped = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
	});
</script>

{#each options as option, index (option.id)}
	<label class="label cursor-pointer gap-2 justify-start">
		<input
			type="checkbox"
			class="checkbox"
			class:checkbox-error={errors.length}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
