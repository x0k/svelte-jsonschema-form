<script lang="ts">
	import type { LabelRootProps } from 'bits-ui';
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';

	import { getThemeContext } from '../context';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Label } = $derived(themeCtx.components);
</script>

<Label
	for={config.id}
	{...config.uiOptions?.labelAttributes as LabelRootProps}
	{...ctx.extraUiOptions?.('labelAttributes', config) as LabelRootProps}
>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
