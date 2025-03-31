<script lang="ts" module>
	import type { SwitchRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnSwitch?: Omit<WithoutChildrenOrChild<SwitchRootProps>, 'type'>;
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
			...config.uiOptions?.shadcnSwitch
		};
		return defineDisabled(ctx, props);
	});
</script>

<Switch bind:checked={() => value ?? false, (v) => (value = v)} {...attributes} />
