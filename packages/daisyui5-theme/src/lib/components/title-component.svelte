<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { title, type, forId, required, config }: ComponentProps<'title'> = $props();

	const widget = $derived(config.uiSchema['ui:widget'])
</script>

{#if type === 'field' && widget !== 'radio' && widget !== 'checkboxes'}
	<label class="label" for={forId}>
		{title}
		{#if required}
			<span>*</span>
		{/if}
	</label>
{:else}
	<legend class="fieldset-legend">{title}</legend>
{/if}
