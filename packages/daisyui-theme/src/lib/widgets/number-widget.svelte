<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'number'> = $props();
</script>

{#if attributes.type === 'range'}
	<span class="px-4 min-w-14">
		{value}
	</span>
{/if}
<input
	type="number"
	bind:value
	class={attributes.type === 'range'
		? 'range range-sm grow w-0'
		: 'input input-sm input-bordered grow'}
	class:input-error={errors.length}
	{...attributes}
/>
