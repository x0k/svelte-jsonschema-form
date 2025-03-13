<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="label-text-alt" {...config.uiOptions?.helpAttributes}>{help}</div>
