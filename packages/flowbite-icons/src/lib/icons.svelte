<script lang="ts" module>
	import ArrowUpOutline from 'flowbite-svelte-icons/ArrowUpOutline.svelte';
	import ArrowDownOutline from 'flowbite-svelte-icons/ArrowDownOutline.svelte';
	import TrashBinOutline from 'flowbite-svelte-icons/TrashBinOutline.svelte';
	import FileCopyOutline from 'flowbite-svelte-icons/FileCopyOutline.svelte';

	export { arrowDownOutline, arrowUpOutline, trashBinOutline, fileCopyOutline };
</script>

{#snippet arrowUpOutline()}
	<ArrowUpOutline />
{/snippet}

{#snippet arrowDownOutline()}
	<ArrowDownOutline />
{/snippet}

{#snippet trashBinOutline()}
	<TrashBinOutline />
{/snippet}

{#snippet fileCopyOutline()}
	<FileCopyOutline />
{/snippet}
