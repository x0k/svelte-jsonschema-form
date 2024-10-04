<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

  import type { SchemaObjectValue, SchemaValue } from "../../schema";
  import type { UiSchema } from "../../ui-schema";
  import { computeId, type IdSchema } from "../../id-schema";
  import { getFormContext } from "../../context";
  import type { Config } from "../../config";
  import { getWidget } from "../../widgets";
  import { getErrors, getUiOptions } from "../../utils";
  import { getTemplate } from '../../templates';

  import { inputAttributes } from "../make-widget-attributes";

  import { getObjectContext } from "./context";
  import { generateNewKey } from "./generate-new-object-key";

  const {
    property,
    name,
    uiSchema,
    idSchema,
    obj = $bindable(),
  }: {
    obj: SchemaObjectValue
    property: string;
    name: string;
    uiSchema: UiSchema;
    idSchema: IdSchema<SchemaValue>
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

  const Template  = $derived(getTemplate(ctx, "field", config));
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