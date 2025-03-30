<script lang="ts" module>
	import type { CheckboxRootProps, WithoutChildrenOrChild } from 'bits-ui';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnCheckbox?: WithoutChildrenOrChild<CheckboxRootProps>;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	const attributes = $derived(
		defineDisabled(ctx, {
			id: config.id,
			name: config.id,
			required: config.required,
			...handlers,
			...config.uiOptions?.shadcnCheckbox
		} satisfies CheckboxRootProps)
	);
</script>

<div class="flex items-center space-x-2">
	<Checkbox bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
