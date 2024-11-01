<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	
	import { getThemeContext } from '../context';

	import DatePicker from './date-picker.svelte';

	const ctx = getThemeContext();

	const { Input } = $derived(ctx.components)

	let { value = $bindable(), attributes, ...rest }: WidgetProps<'text'> = $props();
</script>

{#if attributes.type === 'date'}
	<DatePicker {...rest} {attributes} bind:value />
{:else}
	<Input type="text" bind:value {...attributes} />
{/if}
