<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '../context.js' {
		interface ThemeComponents {
			FieldTitle: Component<HTMLAttributes<HTMLDivElement>>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	import { getThemeContext } from '../context.js';

	const { title, templateType, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { FieldTitle: Title } = $derived(themeCtx.components);
</script>

{#if templateType === 'fieldTemplate'}
	<Title {...titleAttributes(ctx, config, 'titleAttributes', {})}>
		{title}
	</Title>
{:else}
	<div {...titleAttributes(ctx, config, 'titleAttributes', {})}>
		{title}
	</div>
{/if}
