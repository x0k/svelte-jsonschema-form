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
		customInputAttributes,
		disabledProp,
		getFormContext,
		type ComponentProps,
		type Validator
	} from '@sjsf/form';
	import { Tags as TagsInput } from 'flowbite-svelte';

	let { value = $bindable(), config }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();
</script>

<TagsInput
	class="flex-1"
	{...customInputAttributes(ctx, config, 'flowbite3Tags', {
		inputProps: disabledProp<HTMLInputAttributes, any, Validator>(
			{
				id: config.id,
				name: config.id
			},
			config,
			ctx
		)
	})}
	bind:value={() => value ?? [], (v) => (value = v)}
/>
