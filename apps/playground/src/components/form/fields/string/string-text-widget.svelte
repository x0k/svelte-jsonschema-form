<script lang="ts">
  import { noop } from "@/lib/function";
  
  import { getFormContext } from "../../context";
  import type { IdSchema } from "../../id-schema";
  import type { Schema } from "../../schema";
  import type { UiOptions, UiSchema } from "../../ui-schema";
  import { getWidget } from "../../utils";

  import { inputAttributes, makeAttributes } from "../make-widget-attributes";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    uiOptions,
    idSchema,
    required,
  }: {
    name: string;
    value: string | undefined;
    schema: Schema;
    uiSchema: UiSchema;
    uiOptions: UiOptions | undefined;
    idSchema: IdSchema<string>;
    required: boolean;
  } = $props();

  const ctx = getFormContext();

  const Widget = $derived(getWidget(ctx, "text", uiSchema));

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

<Widget label={name} bind:value {attributes} />
