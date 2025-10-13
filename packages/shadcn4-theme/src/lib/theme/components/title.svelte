<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '../context.js' {
		interface ThemeComponents {
			FieldTitle: Component<HTMLAttributes<HTMLDivElement>>;
			FieldLegend: Component<HTMLAttributes<HTMLLegendElement>>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	import { getThemeContext } from '../context.js';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { FieldTitle: Title, FieldLegend: Legend } = $derived(themeCtx.components);
</script>

{#if type === 'field'}
	<Title {...titleAttributes(ctx, config, 'titleAttributes', {})}>
		{title}
	</Title>
{:else}
	<Legend {...titleAttributes(ctx, config, 'titleAttributes', {})}>
		{title}
	</Legend>
{/if}
