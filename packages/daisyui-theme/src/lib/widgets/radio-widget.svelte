<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const guarder = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
		readonly: () => attributes.readonly
	});
</script>

{#each options as option, index (option.value)}
	<label class="label cursor-pointer gap-2">
		<input
			type="radio"
			class="radio radio-sm"
			class:radio-error={errors.length}
			bind:group={guarder.value}
			value={index}
			{...attributes}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
