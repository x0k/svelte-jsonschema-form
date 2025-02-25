<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="label-text-alt" {...config.uiOptions?.helpAttributes}>{help}</div>
