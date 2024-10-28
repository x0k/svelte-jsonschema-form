<script lang="ts">
	// import type { ComponentProps } from 'svelte';
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context'

	const ctx = getThemeContext();

	const { Input } = $derived(ctx.components)

	let { value = $bindable(), attributes }: WidgetProps<'number'> = $props();

	// const mapped = {
	// 	get value() {
	// 		return [value ?? 0];
	// 	},
	// 	set value(v) {
	// 		value = v[0];
	// 	}
	// }
</script>

<!-- {#if attributes.type === 'range'}
	<Slider bind:value={mapped.value} {...attributes as ComponentProps<typeof Slider>} />
{:else} -->
	<Input type="number" bind:value {...attributes} />
<!-- {/if} -->
