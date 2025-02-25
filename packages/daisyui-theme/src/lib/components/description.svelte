<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="label-text-alt" {...config.uiOptions?.descriptionAttributes}>{description}</div>
