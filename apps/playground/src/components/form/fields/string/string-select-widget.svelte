<script lang="ts">
  import { noop } from "@/lib/function";

  import { getFormContext } from "../../context";
  import type { IdSchema } from "../../id-schema";
  import type { Schema, SchemaValue } from "../../schema";
  import type { UiOptions, UiSchema } from "../../ui-schema";
  import { getWidget } from "../../utils";
  import { makeAttributes, selectAttributes } from "../utils";

  import { createOptions } from "../../enum";

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
    value: SchemaValue | undefined;
    schema: Schema;
    uiSchema: UiSchema;
    uiOptions: UiOptions | undefined;
    idSchema: IdSchema<SchemaValue>;
    required: boolean;
  } = $props();

  const ctx = getFormContext();

  const Widget = $derived(getWidget(ctx, "select", uiSchema));

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

<Widget {attributes} label={name} bind:value {options} />
