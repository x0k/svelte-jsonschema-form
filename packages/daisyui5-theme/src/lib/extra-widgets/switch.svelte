<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5Switch?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { config, value = $bindable(), handlers, errors }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.daisyui5Switch,
			ctx.extraUiOptions?.('daisyui5Switch', config)
		)
	);
</script>

<label class="fieldset-label">
	<input
		type="checkbox"
		class={['toggle', errors.length > 0 && 'toggle-error']}
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...attributes}
	/>
	{config.title}
</label>
