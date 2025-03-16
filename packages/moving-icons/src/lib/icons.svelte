<script lang="ts" module>
	import ArrowDown from './arrow-down.svelte';
	import ArrowUp from './arrow-up.svelte';
	import Copy from './copy.svelte';
	import Trash from './trash.svelte';

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
