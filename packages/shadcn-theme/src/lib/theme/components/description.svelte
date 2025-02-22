<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="text-muted-foreground" {...config.uiOptions?.descriptionAttributes}>{description}</div>
