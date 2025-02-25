<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/exports';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnTextareaWidget: WidgetCommonProps<'shadcnTextarea'>;
		}
		interface ComponentBindings {
			shadcnTextareaWidget: 'value';
		}
		interface UiOptions {
			shadcnTextarea?: HTMLTextareaAttributes;
		}
	}
	declare module '@sjsf/legacy-fields/exports' {
		interface WidgetValue {
			shadcnTextarea: string;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Textarea } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['shadcnTextareaWidget'] = $props();

	const attributes = $derived(
		textareaAttributes(ctx, config, handlers, config.uiOptions?.shadcnTextarea)
	);
</script>

<Textarea bind:value {...attributes} />
