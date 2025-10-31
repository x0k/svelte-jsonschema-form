<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Text as SvarText } from '@svar-ui/svelte-core';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarNumber?: SvelteComponentProps<typeof SvarText>;
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

	let { value = $bindable(), config, errors }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));
</script>

<SvarText
	type="number"
	bind:value={() => value ?? '', (v) => (value = (v as number) ?? undefined)}
	{...uiOptionProps('svarNumber')(
		{
			id,
			readonly: config.schema.readOnly,
			disabled: isDisabled(ctx),
			error: errors.length > 0
		},
		config,
		ctx
	)}
/>
