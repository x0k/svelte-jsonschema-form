<script lang="ts">
  let {
    value = $bindable(),
    flags,
    title,
  }: { value: number; flags: [number, string][]; title: string } = $props();

  const count = $derived(
    flags.reduce((c, f) => c + Number(Boolean(value & f[0])), 0)
  );
</script>

<div class="relative group">
  <button class="p-2">
    {title} ({count})
  </button>
  <div class="absolute z-10 hidden group-hover:block">
    <div
      class="p-2 bg-slate-300 dark:bg-slate-600 dark:text-white shadow-lg rounded flex flex-col gap-2 w-max"
    >
      {#each flags as [flag, label]}
        <label>
          <input
            type="checkbox"
            checked={Boolean(value & flag)}
            onchange={() => (value ^= flag)}
          />
          {label}
        </label>
      {/each}
    </div>
  </div>
</div>
