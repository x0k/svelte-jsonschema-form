<script lang="ts">
	import { singleOption, indexMapper, multipleOptions, type WidgetProps } from '@sjsf/form';

	let {
		attributes,
		value = $bindable(),
		options,
		multiple,
		config,
		errors
	}: WidgetProps<'select'> = $props();

	const mapped = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => indexMapper(options),
			// @ts-expect-error
			value: () => value,
			update: (v) => (value = v)
		})
	);
</script>

{#snippet children()}
	{#if !multiple && config.schema.default === undefined}
		<option value={-1}>{attributes.placeholder}</option>
	{/if}
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
{/snippet}
{#if multiple}
	<select
		class={["select select-bordered w-full", errors.length > 0 && "select-error"]}
		bind:value={mapped.value}
		multiple
		{...attributes}
	>
		{@render children()}
	</select>
{:else}
	<select
		class={["select select-bordered w-full", errors.length > 0 && "select-error"]}
		bind:value={mapped.value}
		{...attributes}
	>
		{@render children()}
	</select>
{/if}
