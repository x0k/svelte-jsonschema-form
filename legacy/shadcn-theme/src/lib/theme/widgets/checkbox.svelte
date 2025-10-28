<script lang="ts" module>
	import type { CheckboxProps } from '../types/checkbox';
	import '../types/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnCheckbox?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import {
		createId,
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	const id = $derived(createId(ctx, config.path));

	const { oninput, onchange, ...btuttonHandlers } = $derived(handlers);

	const attributes = $derived(
		customInputAttributes(
			ctx,
			config,
			'shadcnCheckbox',
			handlersAttachment(btuttonHandlers)({
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
	<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
