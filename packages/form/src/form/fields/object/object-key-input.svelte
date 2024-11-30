<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";
  import { type SchemaObjectValue, type SchemaValue } from "@/core/index.js";

  import type { Config } from "../../config.js";
  import type { UiSchema } from "../../ui-schema.js";
  import type { IdSchema } from "../../id-schema.js";
  import {
    getWidget,
    getTemplate,
    inputAttributes,
    getErrors,
    getUiOptions,
    getFormContext,
    makePseudoId,
  } from "../../context/index.js";

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
    makePseudoId(ctx, idSchema?.$id ?? ctx.idPrefix, "key-input")
  );
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const config: Config = $derived({
    name: id,
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
        if (!ctx.validateAdditionalPropertyKey(config, newKey)) {
          return;
        }
        obj[newKey] = obj[property];
        delete obj[property];
        objCtx.validate();
      },
    })
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {errors} showTitle value={property} {config}>
  <Widget {errors} {attributes} {config} bind:value={key.value} />
</Template>
