<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getThemeContext();

	const { Textarea } = $derived(ctx.components)

	let { value = $bindable(), attributes }: WidgetProps<'textarea'> = $props();
</script>

<Textarea bind:value {...attributes} />
