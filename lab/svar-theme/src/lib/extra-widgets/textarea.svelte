<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { TextArea as SvarTextArea } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/textarea';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarTextarea?: SvelteComponentProps<typeof SvarTextArea>;
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
	}: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));
</script>

<SvarTextArea
	bind:value={() => value ?? '', (v) => (value = v)}
	{...uiOptionProps('svarTextarea')(
		{
			id,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			readonly: config.schema.readOnly,
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
