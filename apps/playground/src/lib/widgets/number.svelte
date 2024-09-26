<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    value = $bindable(),
    ...rest
  }: WidgetProps<"number"> = $props();
</script>

<input
  {...rest}
  name={rest.id}
  type="number"
  bind:value
/>
