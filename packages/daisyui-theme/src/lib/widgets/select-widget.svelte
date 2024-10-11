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

	const { readonly, ...rest } = $derived(attributes);

	// NOTE: On current version of svelte (5.0.0-next.259) this solution
	// can prevent only state modification, but the UI will be updated.
	// Looks like inputs with `bind:` attribute are not properly controlled.
	// TODO: Figure out is it a bug or not

	const guarded = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => indexMapper(options),
      // @ts-expect-error
			value: () => value,
			update: (v) => (value = v),
			readonly: () => readonly
		})
	);
</script>

{#snippet children()}
	{#if !multiple && config.schema.default === undefined}
		<option value={-1}>{attributes.placeholder}</option>
	{/if}
	{#each options as option, index (option.value)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
{/snippet}
{#if multiple}
	<select
		class="select select-sm select-bordered grow"
		class:select-error={errors.length}
		bind:value={guarded.value}
		multiple
		{...rest}
	>
		{@render children()}
	</select>
{:else}
	<select
		class="select select-sm select-bordered grow"
		class:select-error={errors.length}
		bind:value={guarded.value}
		{...rest}
	>
		{@render children()}
	</select>
{/if}
