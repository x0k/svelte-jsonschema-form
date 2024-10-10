<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import Datalist, { makeExamples } from './datalist.svelte';

	let { value = $bindable(), attributes, config, errors }: WidgetProps<'number'> = $props();
	const examples = $derived(makeExamples(config, attributes));
</script>

{#if attributes.type === 'range'}
	<span class="px-4 min-w-14">
		{value}
	</span>
{/if}
<input
	type="number"
	bind:value
	class={attributes.type === 'range' ? 'range range-sm grow w-0' : 'input input-sm input-bordered grow'}
  class:input-error={errors.length}
	{...attributes}
/>
<Datalist {examples} />
