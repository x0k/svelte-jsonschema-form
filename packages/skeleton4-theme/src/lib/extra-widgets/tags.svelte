<script lang="ts" module>
	import type { TagsInputRootProps } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/tags';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Tags?: TagsInputRootProps;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, customInputAttributes, getFormContext, createId } from '@sjsf/form';
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['tagsWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path));
</script>

<TagsInput
	{...customInputAttributes(ctx, config, 'skeleton4Tags', {
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
>
	<TagsInput.Control>
		<TagsInput.Context>
			{#snippet children(tagsInput)}
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item {value} {index}>
						<TagsInput.ItemPreview>
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							<TagsInput.ItemDeleteTrigger />
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput />
					</TagsInput.Item>
				{/each}
			{/snippet}
		</TagsInput.Context>
		<TagsInput.Input />
	</TagsInput.Control>
	<TagsInput.HiddenInput />
</TagsInput>
