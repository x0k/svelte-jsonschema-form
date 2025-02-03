<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'number'> = $props();

	const isRange = $derived(attributes.type === 'range');
</script>

<input
	type="number"
	bind:value
	class={isRange ? 'range grow' : 'input input-bordered grow'}
	class:input-error={errors.length && !isRange}
	class:range-error={errors.length && isRange}
	{...attributes}
/>
