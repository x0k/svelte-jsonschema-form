<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Checkbox as SvarCheckbox } from '@svar-ui/svelte-core';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarCheckbox?: SvelteComponentProps<typeof SvarCheckbox>;
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

	let { config, value = $bindable(), handlers }: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarCheckbox
	bind:value={() => value ?? false, (v) => (value = v)}
	{...uiOptionProps('svarCheckbox')(
		{
			id,
			label: config.title,
			disabled: isDisabled(ctx),
			onchange
		},
		config,
		ctx
	)}
/>
