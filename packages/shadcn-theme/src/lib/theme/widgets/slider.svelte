<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getThemeContext();

	const { Slider } = $derived(ctx.components);

	let { value = $bindable(), attributes }: WidgetProps<'number'> = $props();
	const slider = {
		get value() {
			return [value ?? 0];
		},
		set value(v) {
			value = v[0];
		}
	};

	function n(value: HTMLInputAttributes['max']) {
		if (!value) {
			return undefined;
		}
		if (typeof value === 'number') {
			return value;
		}
		const number = Number(value);
		return isNaN(number) ? undefined : number;
	}
</script>

<Slider
	bind:value={slider.value}
	id={attributes.id}
	max={n(attributes.max)}
	min={n(attributes.min)}
	step={n(attributes.step)}
	onchange={attributes.onchange as any}
	oninput={attributes.oninput as any}
	onblur={attributes.onblur as any}
	disabled={attributes.disabled}
/>
