<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), attributes, errors }: WidgetProps<'textarea'> = $props();
</script>

<textarea
	bind:value
	class={["textarea textarea-bordered w-full", errors.length > 0 && "textarea-error"]}
	{...attributes}
></textarea>
