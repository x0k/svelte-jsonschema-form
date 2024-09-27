<script lang="ts">
  import type { WidgetProps } from "@/components/form";

  let {
    value = $bindable(),
    schema,
    uiSchema,
    ...rest
  }: WidgetProps<"number"> = $props();
</script>

<input {...rest} name={rest.id} type="number" bind:value />
