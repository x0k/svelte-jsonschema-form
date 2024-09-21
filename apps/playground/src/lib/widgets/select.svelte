<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    id,
    value = $bindable(),
    options,
    required,
    disabled,
  }: WidgetProps<"select"> = $props();
</script>

<select {id} name={id} bind:value {required} {disabled}>
  {#each options as option, i}
    <option value={i}>
      {option.label}
    </option>
  {/each}
</select>
