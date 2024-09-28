<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../context";
  import { getTemplate, getUiOptions, getWidget } from "../utils";
  import { createOptions } from "../enum";

  import type { FieldProps } from "./model";
  import { makeAttributes, selectAttributes } from "./make-widget-attributes";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
    multiple = false,
  }: FieldProps<"enum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", uiSchema));
  const Widget = $derived(getWidget(ctx, "select", uiSchema));

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));

  const attributes = $derived(
    makeAttributes(
      ctx,
      {
        id: idSchema.$id,
        name: idSchema.$id,
        onfocus: noop,
        onblur: noop,
        required,
      },
      selectAttributes(uiOptions?.input)
    )
  );
  const options = $derived(createOptions(schema, uiSchema) ?? []);
</script>

<Template
  showTitle
  {name}
  {value}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
  {uiOptions}
>
  <Widget {attributes} label={name} bind:value {options} {multiple} />
</Template>
