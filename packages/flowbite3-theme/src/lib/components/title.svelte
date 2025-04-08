<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteTitle?: HTMLAttributes<HTMLParagraphElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<p
	class={['text-gray-900 dark:text-white', { 'font-semibold': type !== 'field' }]}
	{...config.uiOptions?.flowbiteTitle}
	{...ctx.extraUiOptions?.('flowbiteTitle', config)}
>
	{title}
</p>
