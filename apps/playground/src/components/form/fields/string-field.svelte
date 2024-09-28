<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../context";
  import { getTemplate, getUiOptions, getWidget } from "../utils";

  import type { FieldProps } from "./model";
  import { inputAttributes, makeAttributes } from "./make-widget-attributes";

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
  const Widget = $derived(getWidget(ctx, "text", uiSchema));

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
        minlength: schema.minLength,
        pattern: schema.pattern,
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
