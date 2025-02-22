<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="text-muted-foreground" {...config.uiOptions?.helpAttributes}>{help}</div>
