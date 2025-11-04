<script lang="ts" module>
	import type { LabelProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-components/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Label?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, labelAttributes, type ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

{#snippet children()}
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
{/snippet}
<Label
	{...labelAttributes(ctx, config, 'flowbite3Label', {
		children
	})}
/>
