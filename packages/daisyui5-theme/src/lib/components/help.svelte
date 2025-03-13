<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<p class="fieldset-label" {...config.uiOptions?.helpAttributes}>{help}</p>
