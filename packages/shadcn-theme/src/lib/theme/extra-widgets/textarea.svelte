<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import '@sjsf/legacy-fields/extra-widgets/textarea';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnTextarea?: HTMLTextareaAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Textarea } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const attributes = $derived(
		textareaAttributes(ctx, config, handlers, config.uiOptions?.shadcnTextarea)
	);
</script>

<Textarea bind:value {...attributes} />
