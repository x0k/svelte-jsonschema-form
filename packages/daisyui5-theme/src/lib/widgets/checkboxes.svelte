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
	<label class="fieldset-label">
		<input
			type="checkbox"
			class={[
				"checkbox",
				errors.length > 0 && "checkbox-error"
			]}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		{option.label}
	</label>
{/each}
