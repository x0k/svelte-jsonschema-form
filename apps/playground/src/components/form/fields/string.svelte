<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../context";
  import { createOptions } from "../enum";
  import {
    getTemplate,
    getUiOptions,
    getWidget,
    getWidgetProps,
    isSelect,
  } from "../utils";

  import type { FieldProps } from "./model";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", uiSchema));
  // TODO: Separate into two components
  const Widget = $derived(
    getWidget(ctx, isSelect(ctx, schema) ? "select" : "text", uiSchema)
  );
  const options = $derived(createOptions(schema, uiSchema) ?? []);
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<Template
  showTitle={true}
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  {uiOptions}
>
  <Widget
    {...getWidgetProps(ctx, name, schema, uiSchema, idSchema, uiOptions)}
    bind:value
    {options}
    {required}
    onfocus={noop}
    onblur={noop}
  />
</Template>
