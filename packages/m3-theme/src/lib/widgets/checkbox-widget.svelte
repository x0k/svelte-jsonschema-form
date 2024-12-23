<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { config, value = $bindable(), attributes, errors }: WidgetProps<'checkbox'> = $props();
</script>

<label class="label cursor-pointer gap-2">
	<input
		type="checkbox"
		class="checkbox"
		class:checkbox-error={errors.length}
		bind:checked={value}
		{...attributes}
	/>
	<span class="label-text">{config.title}</span>
</label>
