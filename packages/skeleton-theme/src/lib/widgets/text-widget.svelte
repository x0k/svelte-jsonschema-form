<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();
</script>

<input
	type="text"
	bind:value
	class="input"
	{...attributes}
/>
