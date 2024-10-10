<script lang="ts">
	import { multipleOptions, type WidgetProps } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'checkboxes'> = $props();

	const guarder = multipleOptions({
		options: () => options,
		value: () => value,
		update: (v) => (value = v),
		readonly: () => attributes.readonly
	});
</script>

{#each options as option, index (option.value)}
	<label class="label cursor-pointer gap-2 justify-start">
		<input
			type="checkbox"
			class="checkbox checkbox-sm"
			class:checkbox-error={errors.length}
			bind:group={guarder.value}
			value={index}
			{...attributes}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
