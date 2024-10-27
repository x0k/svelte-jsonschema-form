<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { Textarea } from '$lib/components/ui/textarea';

	let { value = $bindable(), attributes }: WidgetProps<'textarea'> = $props();
</script>

<Textarea bind:value {...attributes} />
