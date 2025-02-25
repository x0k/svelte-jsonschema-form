<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<p class="fieldset-label" {...config.uiOptions?.descriptionAttributes}>{description}</p>
