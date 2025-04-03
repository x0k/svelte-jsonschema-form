<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteTitle?: HTMLAttributes<HTMLParagraphElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

<p
	class={['text-gray-900 dark:text-white', { 'font-semibold': type !== 'field' }]}
	{...config.uiOptions?.flowbiteTitle}
>
	{title}
</p>
