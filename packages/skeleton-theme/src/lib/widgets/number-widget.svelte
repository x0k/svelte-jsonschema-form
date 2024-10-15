<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes }: WidgetProps<'number'> = $props();
</script>

<input
	type="number"
	bind:value
	class={attributes.type === 'range'
		? 'range grow w-0'
		: 'input'}
	{...attributes}
/>
