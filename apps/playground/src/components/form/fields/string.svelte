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
  const Widget = $derived(
    getWidget(ctx, isSelect(ctx, schema) ? "select" : "text", uiSchema)
  );
  const options = $derived(createOptions(schema, uiSchema));
</script>

<Widget
  bind:value
  {...getWidgetProps(ctx, name, schema, uiSchema, idSchema)}
  {options}
  {required}
/>
