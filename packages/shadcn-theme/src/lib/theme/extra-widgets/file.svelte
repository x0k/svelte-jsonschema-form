<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/file';

	import '../types/input';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnFile?: Omit<HTMLInputAttributes, 'type'>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: ComponentProps['fileWidget'] = $props();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'shadcnFile', inputAttributes(handlers))
	);
</script>

<Input
	type="file"
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
	bind:files={value}
/>
