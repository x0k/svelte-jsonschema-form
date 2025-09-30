<script lang="ts" module>
	import type { CheckboxProps } from '../types/checkbox.js';
	import '../types/label.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Checkbox?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import {
		composeProps,
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		idFromPath,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const id = $derived(idFromPath(ctx, config.path));

	const attributes = $derived(
		customInputAttributes(
			ctx,
			config,
			'shadcn4Checkbox',
			handlersAttachment(buttonHandlers)({
				id,
				name: id,
				required: config.required,
				onCheckedChange: () => {
					oninput?.();
					onchange?.();
				}
			})
		)
	);
</script>

<div class="flex items-center space-x-2">
	<Checkbox
		bind:checked={
			() => value ?? false,
			(v) => {
				value = v;
			}
		}
		{...attributes}
	/>
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
