<script lang="ts" module>
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import Trash from 'lucide-svelte/icons/trash';
	import Copy from 'lucide-svelte/icons/copy';

	export { arrowDownOutline, arrowUpOutline, trashBinOutline, fileCopyOutline };
</script>

{#snippet arrowUpOutline()}
	<ArrowUp size={20} />
{/snippet}

{#snippet arrowDownOutline()}
	<ArrowDown size={20} />
{/snippet}

{#snippet trashBinOutline()}
	<Trash size={20} />
{/snippet}

{#snippet fileCopyOutline()}
	<Copy size={20} />
{/snippet}
