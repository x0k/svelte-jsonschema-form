<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	import { DateField, TextField } from 'm3-svelte';

	let { value = $bindable(), attributes, errors, config }: WidgetProps<'text'> = $props();
</script>

{#if attributes.type === 'date'}
	<div class="m3-date-field-wrapper">
		<DateField bind:date={value} name={config.name} />
	</div>
{:else}
	<TextField
		name={config.title}
		bind:value
		error={errors.length > 0}
		extraOptions={attributes}
		extraWrapperOptions={{
			style: 'flex-grow: 1;'
		}}
	/>
{/if}

<style>
	.m3-date-field-wrapper {
		flex-grow: 1;
		:global(.m3-container) {
			width: 100%;
		}
	}
</style>
