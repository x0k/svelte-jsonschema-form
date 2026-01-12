<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Switch as SvarSwitch } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarSwitch?: SvelteComponentProps<typeof SvarSwitch>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		getId,
		isDisabled,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<label>
	<SvarSwitch
		bind:value={() => value ?? false, (v) => (value = v)}
		{...uiOptionProps('svarSwitch')(
			{
				id,
				disabled: isDisabled(ctx),
				onchange
			},
			config,
			ctx
		)}
	/>
	{config.title}
</label>

<style>
	label {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 8px;
		font-family: var(--wx-checkbox-font-family);
		font-size: var(--wx-checkbox-font-size);
		line-height: var(--wx-checkbox-line-height);
		font-weight: var(--wx-checkbox-font-weight);
		color: var(--wx-checkbox-font-color);
		cursor: pointer;
	}
</style>
