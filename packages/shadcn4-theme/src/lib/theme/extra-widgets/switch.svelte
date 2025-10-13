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
		createId,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Switch, FieldLabel } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['switchWidget'] = $props();

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const id = $derived(createId(ctx, config.path));
</script>

<div class="flex items-center space-x-3">
	<Switch
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...customInputAttributes(
			ctx,
			config,
			'shadcn4Switch',
			handlersAttachment(buttonHandlers)({
				id,
				name: id,
				required: config.required,
				onCheckedChange: () => {
					oninput?.();
					onchange?.();
				}
			})
		)}
	/>
	<FieldLabel for={id}>{config.title}</FieldLabel>
</div>
