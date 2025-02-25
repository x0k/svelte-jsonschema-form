<script lang="ts" module>
	import type { SelectMultipleRootProps } from 'bits-ui';
	import type { SchemaArrayValue } from '@sjsf/form/core';
	import type { WidgetCommonProps, Options } from '@sjsf/legacy-fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnMultiSelectWidget: WidgetCommonProps<'shadcnMultiSelect'> & Options;
		}
		interface ComponentBindings {
			shadcnMultiSelectWidget: 'value';
		}
		interface UiOptions {
			shadcnMultiSelect?: Omit<SelectMultipleRootProps, 'type'>;
		}
	}
	declare module "@sjsf/legacy-fields/exports" {
		interface WidgetValue {
			shadcnMultiSelect: SchemaArrayValue
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
	}: ComponentProps['shadcnMultiSelectWidget'] = $props();

	const mapped = $derived(
		multipleOptions({
			mapper: () => stringIndexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const attributes = $derived.by(() => {
		const props: SelectMultipleRootProps = {
			type: 'multiple',
			onValueChange: handlers.onchange,
			...config.uiOptions?.shadcnMultiSelect
		};
		return defineDisabled(ctx, props);
	});

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

<Select bind:value={mapped.value} {...attributes}>
	<SelectTrigger>
		<span>
			{triggerLabel}
		</span>
	</SelectTrigger>
	<SelectContent>
		{#if config.schema.default === undefined}
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
