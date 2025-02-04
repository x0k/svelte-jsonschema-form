<script lang="ts">
  import Popup from "./popup.svelte";

  let {
    value = $bindable(),
    flags,
    title,
  }: { value: number; flags: [number, string][]; title: string } = $props();

  const count = $derived(
    flags.reduce((c, f) => c + Number(Boolean(value & f[0])), 0)
  );
</script>

<Popup>
  {#snippet label()}
    {title} ({count})
  {/snippet}
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
</Popup>
