<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteTitle?: HTMLAttributes<HTMLParagraphElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';

	const { title, templateType, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<p
	class={['text-gray-900 dark:text-white', { 'font-semibold': templateType !== 'fieldTemplate' }]}
	{...titleAttributes(ctx, config, 'flowbiteTitle', {})}
>
	{title}
</p>
