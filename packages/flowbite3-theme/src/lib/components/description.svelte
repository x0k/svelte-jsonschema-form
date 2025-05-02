<script lang="ts">
	import { getFormContext, descriptionAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<div
	class="text-sm opacity-70"
	{...descriptionAttributes(ctx, config, 'descriptionAttributes', {})}
>
	{description}
</div>
