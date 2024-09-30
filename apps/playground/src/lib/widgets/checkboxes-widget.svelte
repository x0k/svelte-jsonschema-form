<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"checkboxes"> = $props();
</script>

{#each options as option}
  <label>
    <input
      type="checkbox"
      bind:group={value}
      value={option.value}
      {...attributes}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
