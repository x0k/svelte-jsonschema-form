<script lang="ts" module>
	import type { LabelProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteLabel?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, config }: ComponentProps['label'] = $props();
</script>

<Label for={config.id} {...config.uiOptions?.flowbiteLabel}>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
