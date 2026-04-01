<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	import type { CheckboxProps } from '../types/checkbox.js';
	import '../types/label.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Checkboxes?: CheckboxProps;
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

	const { Checkbox, FieldLabel } = $derived(themeCtx.components);

	let {
		value = $bindable(),
		options,
		config,
		handlers,
		mapped = multipleOptions({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['checkboxesWidget'] = $props();

	const selected = $derived(new Set(mapped.current));

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const id = $derived(getId(ctx, config.path));

	const attributes = $derived(
		customInputAttributes(
			ctx,
			config,
			'shadcn4Checkboxes',
			handlersAttachment(buttonHandlers)({
				...handlers,
				name: id,
				required: config.required
			})
		)
	);
</script>

{#each options as option (option.id)}
	{@const ov = option.mappedValue ?? option.id}
	<div class="flex items-center space-x-3">
		<Checkbox
			checked={selected.has(ov)}
			value={ov}
			onCheckedChange={(checked) => {
				mapped.current = checked
					? mapped.current.concat(ov)
					: mapped.current.filter((v) => v !== ov);
				oninput?.();
				onchange?.();
			}}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<FieldLabel for={option.id}>{option.label}</FieldLabel>
	</div>
{/each}
