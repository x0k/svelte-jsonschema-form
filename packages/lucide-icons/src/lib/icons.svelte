<script lang="ts" module>
  import ArrowDown from "@lucide/svelte/icons/arrow-down";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Copy from "@lucide/svelte/icons/copy";
  import Trash from "@lucide/svelte/icons/trash";

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
