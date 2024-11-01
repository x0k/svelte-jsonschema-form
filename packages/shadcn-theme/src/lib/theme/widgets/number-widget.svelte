<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	import Slider from './slider.svelte';

	const ctx = getThemeContext();

	const { Input } = $derived(ctx.components);

	let { value = $bindable(), attributes, ...rest }: WidgetProps<'number'> = $props();
</script>

{#if attributes.type === 'range'}
	<Slider {...rest} {attributes} bind:value />
{:else}
	<Input type="number" bind:value {...attributes} />
{/if}
