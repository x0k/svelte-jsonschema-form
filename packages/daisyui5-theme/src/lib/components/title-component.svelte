<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { title, type, forId, required }: ComponentProps<'title'> = $props();
</script>

{#if type === 'field'}
	<label class="label" for={forId}>
		{title}
		{#if required}
			<span>*</span>
		{/if}
	</label>
{:else}
	<legend class="fieldset-legend">{title}</legend>
{/if}
