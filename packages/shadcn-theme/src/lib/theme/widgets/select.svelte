<script lang="ts" module>
	import type { SelectSingleRootProps, SelectTriggerProps } from '../types/select';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnSelect?: Omit<SelectSingleRootProps, 'type'>;
			shadcnSelectTrigger?: SelectTriggerProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveInputAttributes, type ComponentProps } from '@sjsf/form';
	import { singleOption, stringIndexMapper } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Select, SelectTrigger, SelectContent, SelectItem } = $derived(themeCtx.components);

	let { handlers, value = $bindable(), options, config }: ComponentProps['selectWidget'] = $props();

	const mapped = $derived(
		singleOption({
			mapper: () => stringIndexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const selectAttributes = $derived(
		retrieveInputAttributes(ctx, config, 'shadcnSelect', () => ({
			onValueChange: handlers.onchange,
			required: config.required
		}))
	);
	const triggerAttributes = $derived(
		retrieveInputAttributes(ctx, config, 'shadcnSelectTrigger', () => ({
			id: config.id,
			name: config.id,
			required: config.required
		}))
	);

	const triggerContent = $derived.by(() => {
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

<Select bind:value={mapped.value} {...selectAttributes} type="single">
	<SelectTrigger {...triggerAttributes}>
		<span>
			{triggerContent}
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
