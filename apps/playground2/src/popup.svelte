<script lang="ts">
  import type { Snippet } from "svelte";

  const { label, children }: { label: Snippet; children: Snippet } = $props();
</script>

<div class="relative group">
  <button class="p-2">
    {@render label()}
  </button>
  <div class="absolute z-10 hidden group-hover:block">
    <div
      class="p-2 bg-slate-300 dark:bg-slate-600 dark:text-white shadow-lg rounded flex flex-col gap-2 w-max"
    >
      {@render children()}
    </div>
  </div>
</div>
