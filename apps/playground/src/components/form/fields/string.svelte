<script lang="ts">
  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import { getTitle, getWidget, isSelect } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();
  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
  }: FieldProps<"string"> = $props();
  const widgetType = $derived(isSelect(ctx, schema) ? "select" : "text");
  const Widget = $derived(getWidget(ctx, widgetType, uiSchema));
  const label = $derived(getTitle(schema, uiSchema) ?? name);
  const options = $derived(
    widgetType === "select" ? createOptions(schema, uiSchema) : undefined
  );
</script>

<Widget id={idSchema.$id} bind:value {schema} {uiSchema} {label} {options} />
