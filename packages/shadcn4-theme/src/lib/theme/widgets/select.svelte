<script lang="ts" module>
	import type { SelectSingleRootProps, SelectTriggerProps } from '../types/select.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Select?: Omit<SelectSingleRootProps, 'type'>;
			shadcn4SelectTrigger?: SelectTriggerProps;
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
	import { singleOption, idMapper, EMPTY_VALUE } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Select, SelectTrigger, SelectContent, SelectItem } = $derived(themeCtx.components);

	let {
		handlers,
		value = $bindable(),
		options,
		config,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		}),
		clearable = config.schema.default === undefined
	}: ComponentProps['selectWidget'] = $props();

	const labels = $derived(new Map(options.map((o) => [o.mappedValue ?? o.id, o.label])));

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const selectAttributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4Select', {
			required: config.required,
			onValueChange: () => {
				oninput?.();
				onchange?.();
			}
		})
	);

	const triggerContent = $derived(labels.get(mapped.current) ?? selectAttributes.placeholder);

	const id = $derived(getId(ctx, config.path));
</script>

<Select bind:value={mapped.current} {...selectAttributes} type="single">
	<SelectTrigger
		class="w-full"
		{...customInputAttributes(
			ctx,
			config,
			'shadcn4SelectTrigger',
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
		{#if clearable}
			<SelectItem value={EMPTY_VALUE}>
				<span class="min-h-5">
					{selectAttributes.placeholder}
				</span>
			</SelectItem>
		{/if}
		{#each options as option (option.id)}
			<SelectItem
				value={option.mappedValue ?? option.id}
				label={option.label}
				disabled={option.disabled}
			/>
		{/each}
	</SelectContent>
</Select>
