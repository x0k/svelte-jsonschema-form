<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();
</script>

<label class="flex items-center space-x-2 cursor-pointer">
	<input
		type="checkbox"
		class="checkbox"
		bind:checked={value}
		{...attributes}
	/>
	<p>{config.title}</p>
</label>
