<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<p class="fieldset-label" {...retrieveUiProps(ctx, config, 'descriptionAttributes', {})}>
	{description}
</p>
