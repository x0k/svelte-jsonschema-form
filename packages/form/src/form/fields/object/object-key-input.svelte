<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";
  import type { Config } from "@/core/config.js";
  import type { UiSchema } from "@/core/ui-schema.js";
  import { type SchemaObjectValue, type SchemaValue } from "@/core/schema/index.js";
  import { type IdSchema, computeId } from "@/core/id-schema.js";

  import { getFormContext } from "../../context.js";
  import { getWidget } from "../../widgets.js";
  import { getErrors, getUiOptions } from "../../utils.js";
  import { getTemplate } from "../../templates/index.js";

  import { inputAttributes } from "../make-widget-attributes.js";

  import { getObjectContext } from "./context.js";
  import { generateNewKey } from "./generate-new-object-key.js";

  const {
    property,
    name,
    uiSchema,
    idSchema,
    obj = $bindable(),
  }: {
    obj: SchemaObjectValue;
    property: string;
    name: string;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue>;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const id = $derived(
    computeId(idSchema ?? { $id: ctx.idPrefix }, "key-input")
  );
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const config: Config = $derived({
    name: `${name}__key`,
    title: `${name} Key`,
    schema: { type: "string" },
    idSchema: { $id: id },
    uiSchema,
    uiOptions,
    required: true,
  });

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "text", config));

  const key = proxy<string | undefined>(() => property);

  const attributes = $derived(
    inputAttributes(ctx, config, {
      onblur: () => {
        if (!key.value || key.value === property) {
          return;
        }
        const newKey = generateNewKey(key.value, objCtx.newKeySeparator, obj);
        obj[newKey] = obj[property];
        delete obj[property];
      },
    })
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {errors} showTitle value={property} {config}>
  <Widget {errors} {attributes} {config} bind:value={key.value} />
</Template>
