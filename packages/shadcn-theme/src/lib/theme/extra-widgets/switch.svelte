<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Switch, SwitchRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnSwitch?: Omit<WithoutChildrenOrChild<SwitchRootProps>, 'type'>;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Switch: Component<WithoutChildrenOrChild<Switch.RootProps>, {}, 'checked' | 'ref'>;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Switch } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['switchWidget'] = $props();

	const attributes = $derived.by(() => {
		const props: SwitchRootProps = {
			id: config.id,
			name: config.id,
			required: config.required,
			onCheckedChange: handlers.onchange,
			...handlers,
			...config.uiOptions?.shadcnSwitch,
			...ctx.extraUiOptions?.('shadcnSwitch', config)
		};
		return defineDisabled(ctx, props);
	});
</script>

<Switch bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
