<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type { TagsInputProps } from '$lib/components/ui/tags-input/types.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasTagsInputWidget: WidgetCommonProps<string[]>;
		}
		interface ComponentBindings {
			shadcnExtrasTagsInputWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasTagsInput?: TagsInputProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			TagsInput: Component<TagsInputProps, {}, 'value'>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let {
		value = $bindable(),
		config,
		handlers
	}: ComponentProps['shadcnExtrasTagsInputWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { TagsInput } = $derived(themeCtx.components);
</script>

<TagsInput
	bind:value={() => value ?? [], (v) => (value = v)}
	{...inputAttributes(ctx, config, 'shadcnExtrasTagsInput', handlers, {})}
/>
