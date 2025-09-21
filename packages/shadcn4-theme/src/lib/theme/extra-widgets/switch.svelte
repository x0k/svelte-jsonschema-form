<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Switch, SwitchRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/switch';

	import '../types/label.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Switch?: WithoutChildrenOrChild<SwitchRootProps>;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Switch: Component<WithoutChildrenOrChild<Switch.RootProps>, {}, 'checked' | 'ref'>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Switch, Label } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['switchWidget'] = $props();

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);
</script>

<Switch
	bind:checked={() => value ?? false, (v) => (value = v)}
	{...customInputAttributes(
		ctx,
		config,
		'shadcn4Switch',
		handlersAttachment(buttonHandlers)({
			id: config.id,
			name: config.id,
			required: config.required,
			onCheckedChange: () => {
				oninput?.();
				onchange?.();
			}
		})
	)}
/>
<Label for={config.id}>{config.title}</Label>
