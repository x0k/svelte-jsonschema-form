<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	const { help, config }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
</script>

<div class="opacity-60" {...retrieveUiProps(ctx, config, 'helpAttributes', {})}>
	{help}
</div>
