<script lang="ts" module>
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type { NLPDateInputProps } from '$lib/components/ui/nlp-date-input/types.js';
	import type { Component } from 'svelte';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasNLPDateInputWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			shadcnExtrasNLPDateInputWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasNLPDateInput?: NLPDateInputProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			NLPDateInput: Component<NLPDateInputProps>;
		}
	}
</script>

<script lang="ts">
	import { getId, getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let { config, value = $bindable() }: ComponentProps['shadcnExtrasNLPDateInputWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { NLPDateInput } = $derived(themeCtx.components);

	const id = $derived(getId(ctx, config.path));
</script>

<NLPDateInput
	{...uiOptionProps('shadcnExtrasNLPDateInput')(
		{
			onChoice: ({ date }) => {
				value = date.toISOString();
			}
		},
		config,
		ctx
	)}
/>
<input type="hidden" name={id} {value} />
