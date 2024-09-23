<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  const {
    id,
    label,
    value,
    onChange,
    required,
    disabled,
    autofocus,
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input
    {id}
    name={id}
    checked={value}
    onchange={(e) => {
      onChange(e.currentTarget.checked);
    }}
    type="checkbox"
    {required}
    {disabled}
    {autofocus}
  />
  {label}
</label>
