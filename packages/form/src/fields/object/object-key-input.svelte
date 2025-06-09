<script lang="ts">
  import {
    type UiSchema,
    type Config,
    getErrors,
    getFormContext,
    createPseudoId,
    getComponent,
    type Id,
    type UiOption,
    retrieveUiOption,
    uiTitleOption,
    type Translate,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.svelte.js";

  const {
    parentId,
    property,
    uiSchema,
    translate,
  }: {
    parentId: Id;
    property: string;
    uiSchema: UiSchema;
    translate: Translate;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const id = $derived(createPseudoId(parentId, "key-input", ctx));
  const config: Config = $derived({
    id,
    name: id,
    title:
      uiTitleOption(ctx, uiSchema) ??
      translate("key-input-title", { name: property }),
    schema: { type: "string" },
    uiSchema,
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
  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config, opt);
</script>

<Template
  type="template"
  showTitle
  useLabel
  {widgetType}
  value={property}
  {config}
  {errors}
  {uiOption}
>
  <Widget
    type="widget"
    {errors}
    {handlers}
    {config}
    {uiOption}
    bind:value={key}
  />
</Template>
