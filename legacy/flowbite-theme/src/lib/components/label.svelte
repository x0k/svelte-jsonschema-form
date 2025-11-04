<script lang="ts" module>
	import type { LabelProps } from 'flowbite-svelte/Label.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteLabel?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, labelAttributes, type ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<Label {...labelAttributes(ctx, config, 'flowbiteLabel', {})}>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
