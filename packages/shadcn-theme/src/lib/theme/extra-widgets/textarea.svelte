<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/textarea';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnTextarea?: HTMLTextareaAttributes;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Textarea: Component<WithElementRef<HTMLTextareaAttributes>, {}, 'value' | 'ref'>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		retrieveAttributes,
		textareaAttributes,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Textarea } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'shadcnTextarea', textareaAttributes(handlers))
	);
</script>

<Textarea bind:value {...attributes} />
