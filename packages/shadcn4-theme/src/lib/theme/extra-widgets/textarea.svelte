<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	declare module '../context.js' {
		interface ThemeComponents {
			Textarea: Component<WithElementRef<HTMLTextareaAttributes>, {}, 'value' | 'ref'>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/textarea.svelte';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Textarea } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();
</script>

<Textarea bind:value {...textareaAttributes(ctx, config, 'textarea', handlers, {})} />
