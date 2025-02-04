<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'text'> = $props();
</script>

<input
	type="text"
	bind:value
	class={["input input-bordered w-full", errors.length > 0 && "input-error"]}
	{...attributes}
/>
