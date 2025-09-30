<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/tags';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Tags?: SvelteComponentProps<typeof TagsInput>;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, customInputAttributes, getFormContext, idFromPath } from '@sjsf/form';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(idFromPath(ctx, config.path))
</script>

<TagsInput
	{...customInputAttributes(ctx, config, 'skeleton3Tags', {
		ids: {
			input: id
		},
		name: id,
		required: config.required,
		max: config.schema.maxItems,
		readOnly: config.schema.readOnly,
		invalid: errors.length > 0,
		onFocusOutside: handlers.onblur,
		onInputValueChange: handlers.oninput,
		onValueChange: (details) => {
			value = details.value;
			handlers.onchange?.();
		},
		value
	})}
/>
