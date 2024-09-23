<script lang="ts">
  import { untrack } from "svelte";
  import { deepEqual } from "fast-equals";

  import type { SchemaValue, WidgetProps } from "@/components/form";

  const {
    id,
    value,
    onChange,
    options,
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
  }: WidgetProps<"select"> = $props();

  let proxyValue = $state.raw<SchemaValue>();
  $effect(() => {
    proxyValue = $state.snapshot(value);
  });

  $effect(() => {
    proxyValue;
    untrack(() => {
      if (
        proxyValue !== undefined &&
        !deepEqual(proxyValue, $state.snapshot(value))
      ) {
        onChange(proxyValue);
      }
    });
  });
</script>

<select
  {id}
  name={readonly ? id : undefined}
  bind:value={proxyValue}
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
