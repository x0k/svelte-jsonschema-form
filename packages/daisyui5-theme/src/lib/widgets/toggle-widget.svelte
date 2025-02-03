<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { config, value = $bindable(), attributes, errors }: WidgetProps<'checkbox'> = $props();
</script>

<label class="fieldset-label">
	<input
		type="checkbox"
		class={["toggle", errors.length > 0 && "toggle-error"]}
		bind:checked={value}
		{...attributes}
	/>
	{config.title}
</label>
