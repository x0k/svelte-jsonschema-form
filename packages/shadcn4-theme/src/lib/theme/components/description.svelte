<script lang="ts" module>
	import '../types/description.js';
</script>

<script lang="ts">
	import { descriptionAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	import { getThemeContext } from '../context.js';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { FieldDescription } = $derived(themeCtx.components);
</script>

<FieldDescription {...descriptionAttributes(ctx, config, 'descriptionAttributes', {})}>
	{description}
</FieldDescription>
