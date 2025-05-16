<script lang="ts" module>
	import type { TagsProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/tags';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Tags?: Omit<TagsProps, 'value'>;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import { Tags as TagsInput } from 'flowbite-svelte';

	let { value = $bindable(), config }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();
</script>

<TagsInput
	{...customInputAttributes(ctx, config, 'flowbite3Tags', {})}
	bind:value={() => value ?? [], (v) => (value = v)}
/>
