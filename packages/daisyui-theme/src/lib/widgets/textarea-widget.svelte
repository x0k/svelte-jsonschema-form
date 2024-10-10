<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'textarea'> = $props();
</script>

<textarea
	bind:value
	class="textarea textarea-bordered textarea-sm grow"
	class:textarea-error={errors.length}
	{...attributes}
></textarea>
