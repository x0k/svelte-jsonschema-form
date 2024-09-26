<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    label,
    value = $bindable(),
    ...rest
  }: WidgetProps<"checkbox"> = $props();
</script>

<label>
  <input
    {...rest}
    type="checkbox"
    bind:checked={value}
    name={rest.id}
  />
  {label}
</label>
