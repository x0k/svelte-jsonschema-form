<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  const {
    id,
    value,
    onChange,
    required,
    disabled,
    readonly,
    autofocus,
    placeholder,
  }: WidgetProps<"text"> = $props();
</script>

<input
  type="text"
  {id}
  name={id}
  {value}
  onchange={(e) => onChange(e.currentTarget.value)}
  {required}
  {disabled}
  {readonly}
  {autofocus}
  {placeholder}
/>
