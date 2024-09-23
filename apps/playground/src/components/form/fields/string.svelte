<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { getWidget, getWidgetProps, isSelect } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();
  const {
    name,
    value,
    onChange,
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"string"> = $props();
  const Widget = $derived(
    getWidget(ctx, isSelect(ctx, schema) ? "select" : "text", uiSchema)
  );
  const options = $derived(createOptions(schema, uiSchema) ?? []);
</script>

<Widget
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema)}
  {value}
  {onChange}
  {options}
  {required}
/>
