<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'number'> = $props();
</script>

<input
	type="number"
	bind:value
	class={[
		'w-full',
		attributes.type === 'range'
			? ['range', errors.length > 0 && 'range-error']
			: ['input input-bordered', errors.length > 0 && 'input-error']
	]}
	{...attributes}
/>
