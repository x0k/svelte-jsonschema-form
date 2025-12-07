<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { ColorSelect as SvarColorSelect } from '@svar-ui/svelte-core';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			svarColorSelectWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			svarColorSelectWidget: 'value';
		}
		interface UiOptions {
			svarColorSelect?: SvelteComponentProps<typeof SvarColorSelect>;
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

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['svarColorSelectWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarColorSelect
	bind:value={() => value ?? '', (v) => (value = v)}
	{...uiOptionProps('svarColorSelect')(
		{
			id,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			onchange
		},
		config,
		ctx
	)}
/>
