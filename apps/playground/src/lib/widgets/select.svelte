<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    id,
    value = $bindable(),
    options,
    required,
    disabled,
    readonly,
    autofocus,
    placeholder
  }: WidgetProps<"select"> = $props();
</script>

<select
  {id}
  name={readonly ? id : undefined}
  bind:value
  {required}
  disabled={disabled || readonly}
  {autofocus}
  {placeholder}
>
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
</select>
{#if readonly}
  <input type="hidden" name={id} {value} />
{/if}
