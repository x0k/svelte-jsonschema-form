<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    value = $bindable(),
    options,
    disabled,
    readonly,
    ...rest
  }: WidgetProps<"select"> = $props();
</script>

<select
  {...rest}
  name={readonly ? rest.id : undefined}
  bind:value
  disabled={disabled || readonly}
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
