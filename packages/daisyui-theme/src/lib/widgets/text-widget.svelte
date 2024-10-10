<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'text'> = $props();
</script>

<input
	type="text"
	bind:value
	class="input input-sm input-bordered grow"
	class:input-error={errors.length}
	{...attributes}
/>
