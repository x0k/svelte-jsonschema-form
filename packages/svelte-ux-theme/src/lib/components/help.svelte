<script lang="ts">
	import { getFormContext, helpAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/help.svelte';

	const { help, config }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
</script>

<p class="fieldset-label" {...helpAttributes(ctx, config, 'helpAttributes', {})}>
	{help}
</p>
