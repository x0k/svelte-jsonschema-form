<script lang="ts">
  import {
    type UiSchema,
    type Config,
    getErrors,
    getUiOptions,
    getFormContext,
    createPseudoId,
    getComponent,
    type Id,
    translate,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.js";

  const {
    parentId,
    property,
    name,
    uiSchema,
  }: {
    parentId: Id;
    property: string;
    name: string;
    uiSchema: UiSchema;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const id = $derived(createPseudoId(parentId, "key-input", ctx));
  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const config: Config = $derived({
    id,
    name: id,
    title: translate(ctx, "key-input-title", { name }),
    schema: { type: "string" },
    uiSchema,
    uiOptions,
    required: true,
  });

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "textWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  let key = $derived<string | undefined>(property);

  const handlers = {
    onblur: () => {
      if (key === undefined || key === property) {
        return;
      }
      objCtx.renameProperty(property, key, config);
    },
  };

  const errors = $derived(getErrors(ctx, id));
</script>

<Template showTitle {widgetType} value={property} {config} {errors}>
  <Widget {errors} {handlers} {config} bind:value={key} />
</Template>
