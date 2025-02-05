<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import { Switch } from 'm3-svelte';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();
</script>

<label class="label">
	<Switch bind:checked={value} extraOptions={attributes} />
	{config.title}
</label>

<style>
	.label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
	}
</style>
