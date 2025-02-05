<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import { Slider, TextField } from 'm3-svelte';

	let { value = $bindable(), attributes, errors, config }: WidgetProps<'number'> = $props();

	const mapped = {
		get value() {
			return value ?? null;
		},
		set value(v) {
			value = v;
		}
	};

	const mapped2 = {
		get value() {
			return value ?? 0;
		},
		set value(v) {
			value = v;
		}
	};
</script>

{#if attributes.type === 'range'}
	<Slider
		bind:value={mapped2.value}
		extraOptions={attributes}
		extraWrapperOptions={{ class: 'm3-container m3-slider-wrapper' }}
	/>
{:else}
	<TextField
		name={config.title}
		bind:value={mapped.value}
		error={errors.length > 0}
		extraOptions={attributes}
		extraWrapperOptions={{
			style: 'flex-grow: 1;'
		}}
	/>
{/if}

<style>
	:global(.m3-slider-wrapper) {
		flex-grow: 1;
	}
</style>
