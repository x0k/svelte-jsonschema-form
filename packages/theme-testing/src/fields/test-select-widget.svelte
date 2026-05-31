<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  let {
    value = $bindable(),
    options,
  }: ComponentProps["selectWidget"] = $props();
</script>

<select
  data-testid="combination-selector"
  value={value as number | undefined}
  onchange={(event) => {
    const selected = Number(event.currentTarget.value);
    value = Number.isNaN(selected) ? undefined : selected;
  }}
>
  {#each options as option (option.id)}
    <option value={option.value as number} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
