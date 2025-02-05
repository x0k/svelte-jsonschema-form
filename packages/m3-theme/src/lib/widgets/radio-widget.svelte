<script lang="ts">
	import { type WidgetProps, indexMapper, singleOption } from '@sjsf/form';
	import { RadioAnim1 } from 'm3-svelte';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
</script>

{#each options as option, index (option.id)}
	<label class="label">
		<RadioAnim1>
			<input
				type="radio"
				bind:group={mapped.value}
				value={index}
				{...attributes}
				id={option.id}
				disabled={option.disabled || attributes.disabled}
			/>
		</RadioAnim1>
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
