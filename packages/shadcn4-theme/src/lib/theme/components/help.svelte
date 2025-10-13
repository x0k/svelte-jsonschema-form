<script lang="ts" module>
	import '../types/description.js';
</script>

<script lang="ts">
	import { getFormContext, helpAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	import { getThemeContext } from '../context.js';

	const { help, config }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { FieldDescription } = $derived(themeCtx.components);
</script>

<FieldDescription {...helpAttributes(ctx, config, 'helpAttributes', {})}>
	{help}
</FieldDescription>
