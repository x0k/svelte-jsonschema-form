<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="opacity-60" {...config.uiOptions?.descriptionAttributes}>{description}</div>
