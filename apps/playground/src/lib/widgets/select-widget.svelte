<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    attributes,
    value = $bindable(),
    options,
    multiple,
  }: WidgetProps<"select"> = $props();
  const { readonly, ...rest } = attributes
</script>

{#snippet children()}
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
{/snippet}
{#if multiple}
  <select
    multiple
    bind:value
    style="flex-grow: 1"
    {...attributes}
    disabled={rest.disabled || readonly}
  >
    {@render children()}
  </select>
{:else}
  <select
    bind:value
    style="flex-grow: 1"
    {...attributes}
    disabled={rest.disabled || readonly}
  >
    {@render children()}
  </select>
{/if}
{#if readonly}
  <input type="hidden" name={rest.id} {value} />
{/if}
