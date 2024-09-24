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
  }: WidgetProps<"text"> = $props();
</script>

<input
  {id}
  name={id}
  type="text"
  bind:value
  {required}
  {disabled}
  {readonly}
  {autofocus}
  {placeholder}
/>
