<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/multi-select';

	import type { SelectMultipleRootProps, SelectTriggerProps } from '../types/select';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnMultiSelect?: Omit<SelectMultipleRootProps, 'type'>;
			shadcnMultiSelectTrigger?: SelectTriggerProps;
		}
	}
</script>

<script lang="ts">
	import { getId, customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';

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

	const labels = $derived(new Map(options.map((o) => [o.id, o.label])));
	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const selectAttributes = $derived(
		customInputAttributes(ctx, config, 'shadcnMultiSelect', {
			onValueChange: handlers.onchange,
			required: config.required
		})
	);

	const triggerContent = $derived(
		mapped.value.map((id) => labels.get(id)).join(', ') || selectAttributes.placeholder
	);

	const id = $derived(getId(ctx, config.path));
</script>

<Select bind:value={mapped.value} {...selectAttributes} type="multiple">
	<SelectTrigger
		{...customInputAttributes(ctx, config, 'shadcnMultiSelectTrigger', {
			id,
			name: id
		})}
	>
		<span>
			{triggerContent}
		</span>
	</SelectTrigger>
	<SelectContent>
		{#each options as option (option.id)}
			<SelectItem value={option.id} label={option.label} disabled={option.disabled} />
		{/each}
	</SelectContent>
</Select>
