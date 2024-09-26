<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";
  import { noop } from "@/lib/function";

  import type { Schema, SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import type { IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import { getUiOptions, getWidget, getWidgetProps } from "../../utils";

  import { getObjectContext } from "./context";
  import { generateNewKey } from "./utils";

  const {
    property,
    name,
    uiSchema,
    idSchema,
  }: {
    property: string;
    name: string;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue> | undefined;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const Widget = $derived(getWidget(ctx, "text", uiSchema));

  const schema: Schema = {
    type: "string",
  };

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));

  const key = createTransformation<string | undefined>({
    transform: () => property,
  });
</script>

<Widget
  {...getWidgetProps(
    ctx,
    `${name} Key`,
    schema,
    uiSchema,
    {
      $id: idSchema
        ? `${idSchema.$id}${ctx.idSeparator}key-input`
        : `${ctx.idPrefix}${ctx.idSeparator}key-input`,
    },
    uiOptions
  )}
  bind:value={key.value}
  onblur={() => {
    if (!key.value || key.value === property) {
      return;
    }
    const obj = objCtx.value;
    if (obj === undefined) {
      console.warn("Object value is undefined");
      return;
    }
    const newKey = generateNewKey(key.value, objCtx.newKeySeparator, obj);
    obj[newKey] = obj[property];
    delete obj[property];
  }}
  onfocus={noop}
  required
/>
