<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../context";
  import {
    getTemplate,
    getUiOptions,
    getWidget,
    getWidgetProps,
  } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    idSchema,
    uiSchema,
    required,
  }: FieldProps<"number"> = $props();

  const Template = $derived(getTemplate(ctx, "field", uiSchema));
  const Widget = $derived(getWidget(ctx, "number", uiSchema));
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
    {required}
    onblur={noop}
    onfocus={noop}
  />
</Template>
