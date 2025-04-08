<script lang="ts" module>
	import type { LabelProps } from 'flowbite-svelte/Label.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteLabel?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<Label
	for={config.id}
	{...config.uiOptions?.flowbiteLabel}
	{...ctx.extraUiOptions?.('flowbiteLabel', config)}
>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
