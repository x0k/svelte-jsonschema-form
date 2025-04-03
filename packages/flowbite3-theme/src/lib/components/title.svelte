<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { LabelProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteLabel?: LabelProps;
			flowbiteTitle?: HTMLAttributes<HTMLParagraphElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

{#if type === 'field'}
	<Label for={config.id} {...config.uiOptions?.flowbiteLabel}>
		{title}
		{#if config.required}
			<span>*</span>
		{/if}
	</Label>
{:else}
	<p class="font-semibold text-gray-900 dark:text-white" {...config.uiOptions?.flowbiteTitle}>
		{title}
	</p>
{/if}
