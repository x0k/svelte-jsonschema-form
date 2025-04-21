<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/multi-select';

	import type { SelectMultipleRootProps, SelectTriggerProps } from '../types/select';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnMultiSelect?: SelectMultipleRootProps;
			shadcnMultiSelectTrigger?: SelectTriggerProps;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, stringIndexMapper } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Select, SelectTrigger, SelectContent, SelectItem } = $derived(themeCtx.components);

	let {
		handlers,
		value = $bindable(),
		options,
		config
	}: ComponentProps['multiSelectWidget'] = $props();

	const mapped = $derived(
		multipleOptions({
			mapper: () => stringIndexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const selectAttributes = $derived.by(() => {
		const props: SelectMultipleRootProps = {
			type: 'multiple',
			onValueChange: handlers.onchange,
			required: config.required,
			...config.uiOptions?.shadcnMultiSelect,
			...ctx.extraUiOptions?.('shadcnMultiSelect', config)
		};
		return defineDisabled(ctx, props);
	});
	const triggerAttributes = $derived({
		id: config.id,
		name: config.id,
		required: config.required,
		...config.uiOptions?.shadcnMultiSelectTrigger,
		...ctx.extraUiOptions?.('shadcnMultiSelectTrigger', config)
	});

	const triggerLabel = $derived.by(() => {
		const v = mapped.value;
		if (Array.isArray(v)) {
			return v.map((i) => options[Number(i)].label).join(', ') || selectAttributes.placeholder;
		}
		if (v in options) {
			return options[Number(v)].label;
		}
		return selectAttributes.placeholder;
	});
</script>

<Select bind:value={mapped.value} {...selectAttributes}>
	<SelectTrigger {...triggerAttributes}>
		<span>
			{triggerLabel}
		</span>
	</SelectTrigger>
	<SelectContent>
		{#if config.schema.default === undefined}
			<SelectItem value="-1">
				<span class="min-h-5">
					{selectAttributes.placeholder}
				</span>
			</SelectItem>
		{/if}
		{#each options as option, index (option.id)}
			{@const indexStr = index.toString()}
			<SelectItem value={indexStr} label={option.label} disabled={option.disabled} />
		{/each}
	</SelectContent>
</Select>
