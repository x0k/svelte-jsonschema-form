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
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';

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

	const labels = $derived(new Map(options.map((o) => [o.id, o.label])));
	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

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

	const triggerContent = $derived(
		mapped.current.map((id) => labels.get(id)).join(', ') || selectAttributes.placeholder
	);

	const id = $derived(getId(ctx, config.path));
</script>

<Select bind:value={mapped.current} {...selectAttributes} type="multiple">
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
		{#each options as option (option.id)}
			<SelectItem value={option.id} label={option.label} disabled={option.disabled} />
		{/each}
	</SelectContent>
</Select>
