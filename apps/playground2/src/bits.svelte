<script lang="ts">
  let {
    value = $bindable(),
    flags,
    title,
  }: { value: number; flags: [number, string][]; title: string } = $props();
</script>

<p>
  {title}
</p>
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
