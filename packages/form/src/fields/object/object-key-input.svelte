<script lang="ts">
  import {
    type UiSchema,
    type Config,
    getFieldErrors,
    getFormContext,
    getComponent,
    type UiOption,
    retrieveUiOption,
    uiTitleOption,
    type Translate,
    createPseudoPath,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.svelte.js";

  const {
    parent,
    property,
    uiSchema,
    translate,
  }: {
    parent: Config;
    property: string;
    uiSchema: UiSchema;
    translate: Translate;
  } = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const config: Config = $derived({
    path: createPseudoPath(ctx, parent.path, "key-input"),
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

  const errors = $derived(getFieldErrors(ctx, config.path));
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
