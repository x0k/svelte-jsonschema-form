<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="opacity-60" {...config.uiOptions?.helpAttributes}>{help}</div>
