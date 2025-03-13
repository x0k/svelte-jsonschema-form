<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="text-muted-foreground" {...config.uiOptions?.helpAttributes}>{help}</div>
