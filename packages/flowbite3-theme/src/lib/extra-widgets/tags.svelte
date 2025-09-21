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
	import type { HTMLInputAttributes } from 'svelte/elements';
	import {
		composeProps,
		customInputAttributes,
		disabledProp,
		getFormContext,
		handlersAttachment,
		type ComponentProps,
		type Validator
	} from '@sjsf/form';
	import { Tags as TagsInput } from 'flowbite-svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();
	const { onchange, ...inputHandlers } = $derived(handlers);
</script>

<TagsInput
	class="flex-1"
	{...customInputAttributes(ctx, config, 'flowbite3Tags', {
		inputProps: composeProps(
			ctx,
			config,
			{
				id: config.id,
				name: config.id
			} satisfies HTMLInputAttributes as HTMLInputAttributes,
			handlersAttachment(inputHandlers),
			disabledProp
		)
	})}
	bind:value={
		() => value ?? [],
		(v) => {
			value = v;
			onchange?.();
		}
	}
/>
