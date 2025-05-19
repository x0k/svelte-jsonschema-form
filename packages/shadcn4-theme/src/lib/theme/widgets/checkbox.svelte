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
	import { customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4Checkbox', {
			...handlers,
			id: config.id,
			name: config.id,
			required: config.required
		})
	);
</script>

<div class="flex items-center space-x-2">
	<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
