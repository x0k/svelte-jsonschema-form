<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    id,
    label,
    value = $bindable(),
    required,
    disabled,
    autofocus,
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input
    {id}
    name={id}
    bind:checked={value}
    type="checkbox"
    {required}
    {disabled}
    {autofocus}
  />
  {label}
</label>
