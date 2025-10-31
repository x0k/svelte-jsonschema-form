<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/multi-select';

	import type { SelectMultipleRootProps, SelectTriggerProps } from '../types/select.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4MultiSelect?: Omit<SelectMultipleRootProps, 'type'>;
			shadcn4MultiSelectTrigger?: SelectTriggerProps;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		getId,
		type ComponentProps
	} from '@sjsf/form';
	import { multipleOptions, stringIndexMapper } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context.js';

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

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const selectAttributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4MultiSelect', {
			onValueChange: () => {
				oninput?.();
				onchange?.();
			},
			required: config.required
		})
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

	const id = $derived(getId(ctx, config.path));
</script>

<Select bind:value={mapped.value} {...selectAttributes} type="multiple">
	<SelectTrigger
		class="w-full"
		{...customInputAttributes(
			ctx,
			config,
			'shadcn4MultiSelectTrigger',
			handlersAttachment(buttonHandlers)({
				id,
				name: id
			})
		)}
	>
		<span>
			{triggerContent}
		</span>
	</SelectTrigger>
	<SelectContent>
		{#each options as option, index (option.id)}
			{@const indexStr = index.toString()}
			<SelectItem value={indexStr} label={option.label} disabled={option.disabled} />
		{/each}
	</SelectContent>
</Select>
