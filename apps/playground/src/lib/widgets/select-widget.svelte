<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"select"> = $props();
  const { readonly, ...rest } = attributes
</script>

<select
  bind:value
  {...attributes}
  disabled={rest.disabled || readonly}
  style={`flex-grow: 1; ${attributes?.style || ""}`}
>
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
</select>
{#if readonly}
  <input type="hidden" name={rest.id} {value} />
{/if}
