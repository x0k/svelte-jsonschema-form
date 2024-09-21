<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { getWidget, getWidgetProps, isSelect } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();
  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"string"> = $props();
  const widgetType = $derived(isSelect(ctx, schema) ? "select" : "text");
  const Widget = $derived(getWidget(ctx, widgetType, uiSchema));
  const options = $derived(
    widgetType === "select" ? createOptions(schema, uiSchema) : undefined
  );
</script>

<Widget
  bind:value
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema)}
  {options}
  {required}
/>
