<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/description.svelte';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<p
	class="fieldset-label"
	{...config.uiOptions?.descriptionAttributes}
	{...ctx.extraUiOptions?.('descriptionAttributes', config)}
>
	{description}
</p>
