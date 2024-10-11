<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import Label from 'flowbite-svelte/Label.svelte';

	const { title, type, forId, required }: ComponentProps<'title'> = $props();
</script>

{#if type === 'field'}
	<Label for={forId}>
		{title}
		{#if required}
			<span>*</span>
		{/if}
	</Label>
{:else}
	<p class="font-semibold text-gray-900 dark:text-white">{title}</p>
{/if}
