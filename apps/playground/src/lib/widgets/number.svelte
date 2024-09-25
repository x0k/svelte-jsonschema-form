<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    id,
    value = $bindable(),
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
  }: WidgetProps<"number"> = $props();
</script>

<input
  {id}
  name={id}
  type="number"
  bind:value
  {required}
  {disabled}
  {readonly}
  {autofocus}
  {placeholder}
/>
