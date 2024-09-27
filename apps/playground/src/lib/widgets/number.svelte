<script lang="ts">
  import { getFormContext, type WidgetProps } from "@/components/form";
  import { getUiOptions } from "@/components/form/utils";

  let {
    value = $bindable(),
    schema,
    uiSchema,
    ...rest
  }: WidgetProps<"number"> = $props();
  const ctx = getFormContext();
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<input
  {...rest}
  name={rest.id}
  type={uiOptions?.inputType ?? "number"}
  bind:value
  min={schema.minimum}
  max={schema.maximum}
  step={schema.multipleOf}
/>
