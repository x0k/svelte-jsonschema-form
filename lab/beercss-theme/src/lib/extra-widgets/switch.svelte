<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/switch';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssSwitch?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { config, value = $bindable(), handlers }: ComponentProps['switchWidget'] = $props();

	const ctx = getFormContext();
</script>

<label class="switch">
	<input
		{...inputAttributes(ctx, config, 'beercssSwitch', handlers, {})}
		type="checkbox"
		bind:checked={() => value ?? false, (v) => (value = v)}
	/>
	<span>{config.title}</span>
</label>

<style>
	.switch span {
		padding-left: 0.5rem;
	}
</style>
