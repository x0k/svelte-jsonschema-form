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
	import { getFormContext, retrieveAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'shadcnCheckbox', () => ({
			...handlers,
			id: config.id,
			name: config.id,
			required: config.required,
		}))
	);
</script>

<div class="flex items-center space-x-2">
	<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
