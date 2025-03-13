<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="label-text-alt" {...config.uiOptions?.descriptionAttributes}>{description}</div>
