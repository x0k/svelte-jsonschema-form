<script lang="ts">
	import { descriptionAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<div
	class="text-muted-foreground text-sm"
	{...descriptionAttributes(ctx, config, 'descriptionAttributes', {})}
>
	{description}
</div>
