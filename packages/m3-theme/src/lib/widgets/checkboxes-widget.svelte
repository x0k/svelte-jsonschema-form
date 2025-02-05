<script lang="ts">
	import { multipleOptions, indexMapper, type WidgetProps } from '@sjsf/form';
	import { Checkbox } from 'm3-svelte';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'checkboxes'> = $props();

	const mapped = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

{#each options as option, index (option.id)}
	<label class="label">
		<Checkbox>
			<input
				type="checkbox"
				bind:group={mapped.value}
				value={index}
				{...attributes}
				id={option.id}
				disabled={option.disabled || attributes.disabled}
			/>
		</Checkbox>
		{option.label}
	</label>
{/each}

<style>
	.label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
	}
</style>
