<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'number'> = $props();
</script>

<input
	type="number"
	bind:value
	class={attributes.type === 'range'
		? 'range range-sm grow'
		: 'input input-sm input-bordered grow'}
	class:input-error={errors.length}
	{...attributes}
/>
