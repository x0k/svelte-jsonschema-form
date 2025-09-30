<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	import type { CheckboxProps } from '../types/checkbox.js';

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
		createId,
		type ComponentProps
	} from '@sjsf/form';
	import { multipleOptions, stringIndexMapper } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	let {
		value = $bindable(),
		options,
		config,
		handlers
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const indexes = $derived(new Set(mapped.value));

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const id = $derived(createId(ctx, config.path));

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

{#each options as option, index (option.id)}
	{@const indexStr = index.toString()}
	<div class="flex items-center space-x-2">
		<Checkbox
			checked={indexes.has(indexStr)}
			value={indexStr}
			onCheckedChange={(v) => {
				mapped.value = v
					? mapped.value.concat(indexStr)
					: mapped.value.filter((index) => index !== indexStr);
				oninput?.();
				onchange?.();
			}}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<Label for={option.id}>{option.label}</Label>
	</div>
{/each}
