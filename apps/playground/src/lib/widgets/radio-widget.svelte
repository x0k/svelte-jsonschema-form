<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"radio"> = $props();
</script>

{#each options as option}
  <label>
    <input
      type="radio"
      bind:group={value}
      value={option.value}
      {...attributes}
    />
    {option.label}
  </label>
{/each}
