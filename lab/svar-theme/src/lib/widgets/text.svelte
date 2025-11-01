<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Text as SvarText } from '@svar-ui/svelte-core';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarText?: SvelteComponentProps<typeof SvarText>;
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

	let { value = $bindable(), config, errors, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));
</script>

<SvarText
	bind:value={() => value ?? '', (v) => (value = v)}
	{...uiOptionProps('svarText')(
		{
			id,
			readonly: config.schema.readOnly,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			onchange: ({ input }) => {
				if (input) {
					handlers.oninput?.();
				} else {
					handlers.onchange?.();
				}
			}
		},
		config,
		ctx
	)}
/>
