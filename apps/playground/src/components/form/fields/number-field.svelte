<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../context";
  import { getTemplate, getUiOptions, getWidget } from "../utils";

  import type { FieldProps } from "./model";
  import { inputAttributes, makeAttributes } from "./utils";

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

  const attributes = $derived(
    makeAttributes(
      ctx,
      {
        id: idSchema.$id,
        name: idSchema.$id,
        onfocus: noop,
        onblur: noop,
        required,
        // TODO: Support for exclusiveMinimum and exclusiveMaximum
        min: schema.minimum,
        max: schema.maximum,
        step: schema.multipleOf,
      },
      inputAttributes(uiOptions?.input)
    )
  );
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
  <Widget label={name} bind:value {attributes} />
</Template>
