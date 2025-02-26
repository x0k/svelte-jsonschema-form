<script lang="ts" module>
	import ArrowUp from 'svelte-radix/ArrowUp.svelte';
	import ArrowDown from 'svelte-radix/ArrowDown.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Copy from 'svelte-radix/Copy.svelte';

	export { arrowDownOutline, arrowUpOutline, trashBinOutline, fileCopyOutline };
</script>

{#snippet arrowUpOutline()}
	<ArrowUp />
{/snippet}

{#snippet arrowDownOutline()}
	<ArrowDown />
{/snippet}

{#snippet trashBinOutline()}
	<Trash />
{/snippet}

{#snippet fileCopyOutline()}
	<Copy />
{/snippet}
