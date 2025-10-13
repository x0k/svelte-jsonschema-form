<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '../context.js' {
		interface ThemeComponents {
			FieldError: Component<HTMLAttributes<HTMLDivElement>>;
		}
	}
</script>

<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	import { getThemeContext } from '../context.js';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { FieldError } = $derived(themeCtx.components);
</script>

<FieldError>
	<ul
		class="ml-4 flex list-disc flex-col gap-1"
		{...errorsListAttributes(ctx, config, 'errorsList', {})}
	>
		{#each errors as error}
			<li>{error}</li>
		{/each}
	</ul>
</FieldError>
