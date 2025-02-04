<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v),
	});
</script>

{#each options as option, index (option.id)}
	<label class="fieldset-label">
		<input
			type="radio"
			class={["radio", errors.length > 0 && "radio-error"]}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		{option.label}
	</label>
{/each}
