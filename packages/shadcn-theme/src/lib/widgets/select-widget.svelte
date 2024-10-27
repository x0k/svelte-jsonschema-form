<script lang="ts">
	import { singleOption, stringIndexMapper, multipleOptions, type WidgetProps } from '@sjsf/form';

	import { Select, SelectItem, SelectTrigger, SelectContent } from '$lib/components/ui/select';

	let {
		attributes,
		value = $bindable(),
		options,
		multiple,
		config
	}: WidgetProps<'select'> = $props();

	const mapped = $derived(
		(multiple ? multipleOptions : singleOption)({
			mapper: () => stringIndexMapper(options),
			// @ts-expect-error
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const triggerLabel = $derived.by(() => {
		const v = mapped.value;
		if (Array.isArray(v)) {
			return v.map((i) => options[Number(i)].label).join(', ') || attributes.placeholder;
		}
		if (v in options) {
			return options[Number(v)].label;
		}
		return attributes.placeholder;
	});
</script>

<Select type={multiple ? 'multiple' : 'single'} bind:value={mapped.value} {...attributes}>
	<SelectTrigger>
		<span>
			{triggerLabel}
		</span>
	</SelectTrigger>
	<SelectContent>
		{#if !multiple && config.schema.default === undefined}
			<SelectItem value="-1">
				<span class="min-h-5">
					{attributes.placeholder}
				</span>
			</SelectItem>
		{/if}
		{#each options as option, index (option.id)}
			{@const indexStr = index.toString()}
			<SelectItem value={indexStr} label={option.label} disabled={option.disabled} />
		{/each}
	</SelectContent>
</Select>

<!-- {#snippet children()}
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
	<select class="select" bind:value={mapped.value} multiple {...attributes}>
		{@render children()}
	</select>
{:else}
	<select class="select" bind:value={mapped.value} {...attributes}>
		{@render children()}
	</select>
{/if} -->
