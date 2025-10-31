<script lang="ts" module>
	import type { TagsProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/tags';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Tags?: Omit<TagsProps, 'value'>;
		}
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import {
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		getId,
		type ComponentProps
	} from '@sjsf/form';
	import TagsInput from 'flowbite-svelte/Tags.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();
	const { onchange, ...inputHandlers } = $derived(handlers);
	const id = $derived(getId(ctx, config.path));
</script>

<TagsInput
	class="flex-1"
	{...customInputAttributes(ctx, config, 'flowbite3Tags', {
		inputProps: handlersAttachment(inputHandlers)({
			id,
			name: id
		} satisfies HTMLInputAttributes)
	})}
	bind:value={
		() => value ?? [],
		(v) => {
			value = v;
			onchange?.();
		}
	}
/>
