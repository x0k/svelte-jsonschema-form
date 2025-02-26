<script lang="ts" module>
	import ArrowUp from 'svelte-radix/ArrowUp.svelte';
	import ArrowDown from 'svelte-radix/ArrowDown.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Copy from 'svelte-radix/Copy.svelte';

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
