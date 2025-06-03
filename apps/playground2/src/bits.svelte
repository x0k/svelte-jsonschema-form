<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

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
  <Label>
    <Checkbox
      checked={Boolean(value & flag)}
      onCheckedChange={() => (value ^= flag)}
    />
    {label}
  </Label>
{/each}
