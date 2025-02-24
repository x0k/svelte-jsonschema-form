<script lang="ts">
	import type { LabelRootProps } from 'bits-ui';
	import type { ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { title, type, forId, required, config }: ComponentProps['title'] = $props();

	const themeCtx = getThemeContext();

	const { Label } = $derived(themeCtx.components);
</script>

{#if type === 'field'}
	<Label for={forId} {...config.uiOptions?.labelAttributes as LabelRootProps}>
		{title}
		{#if required}
			<span>*</span>
		{/if}
	</Label>
{:else}
	<div class="text-lg font-medium" {...config.uiOptions?.titleAttributes}>{title}</div>
{/if}
