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
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		createId,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, FieldLabel } = $derived(themeCtx.components);

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const id = $derived(createId(ctx, config.path));

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

<div class="flex items-center space-x-3">
	<Checkbox
		bind:checked={
			() => value ?? false,
			(v) => {
				value = v;
			}
		}
		{...attributes}
	/>
	<FieldLabel for={attributes.id}>
		{config.title}
	</FieldLabel>
</div>
