<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/color-picker';

	import type { InputProps } from '../types/input.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4ColorPicker?: InputProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['colorPickerWidget'] = $props();

	const attributes = $derived(
		inputAttributes(ctx, config, 'shadcn4ColorPicker', handlers, {
			type: 'color'
		})
	);
</script>

<Input bind:value {...attributes} />
