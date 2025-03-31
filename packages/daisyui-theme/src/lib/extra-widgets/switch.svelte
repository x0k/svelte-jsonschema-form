<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyuiSwitch?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { config, value = $bindable(), handlers, errors }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyuiSwitch)
	);
</script>

<label class="label cursor-pointer gap-2">
	<input
		type="checkbox"
		class={['toggle', errors.length > 0 && 'toggle-error']}
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...attributes}
	/>
	<span class="label-text">{config.title}</span>
</label>
