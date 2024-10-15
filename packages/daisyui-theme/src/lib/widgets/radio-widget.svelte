<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
	});
</script>

{#each options as option, index (option.value)}
	<label class="label cursor-pointer gap-2">
		<input
			type="radio"
			class="radio"
			class:radio-error={errors.length}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
