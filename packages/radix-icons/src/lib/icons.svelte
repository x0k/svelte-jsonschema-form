<script lang="ts" module>
	import { ArrowUp, ArrowDown, Trash, Copy } from 'svelte-radix';

	export { arrowDownOutline, arrowUpOutline, trashBinOutline, fileCopyOutline };
</script>

{#snippet arrowUpOutline()}
	<ArrowUp size="20" />
{/snippet}

{#snippet arrowDownOutline()}
	<ArrowDown size="20" />
{/snippet}

{#snippet trashBinOutline()}
	<Trash size="20" />
{/snippet}

{#snippet fileCopyOutline()}
	<Copy size="20" />
{/snippet}
