<script lang="ts">
  import {
    type UiSchema,
    type Config,
    getErrors,
    getFormContext,
    createPseudoId,
    getComponent,
    type Id,
    translate,
    type UiOption,
    retrieveUiOption,
  } from "@/form/index.js";

  import { getObjectContext } from "./context.svelte.js";

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
  const config: Config = $derived({
    id,
    name: id,
    _title: translate(ctx, "key-input-title", { name }),
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
  <Widget type="widget" {errors} {handlers} {config} bind:value={key} />
</Template>
