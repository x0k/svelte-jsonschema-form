<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

<div class="filter">
	<input
		class="btn filter-reset"
		type="radio"
		bind:group={mapped.value}
		{...attributes}
		aria-label="Reset"
	/>
	{#each options as option, index (option.id)}
		<input
			type="radio"
			class={["btn", errors.length > 0 && "btn-error"]}
			bind:group={mapped.value}
			value={index}
			aria-label={option.label}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
	{/each}
</div>
