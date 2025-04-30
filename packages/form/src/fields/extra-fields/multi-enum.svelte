<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      checkboxesWidget: {};
    }
  }
</script>

<script lang="ts">
  import { isSchemaObjectValue } from "@/core/index.js";
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/multi-enum.js";

  import { createOptions } from "../enum.js";
  import "../extra-widgets/checkboxes.js";

  let {
    config,
    uiOption,
    value = $bindable(),
  }: ComponentProps["multiEnumField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "checkboxesWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived.by(() => {
    const { items } = config.schema;
    const itemSchema = isSchemaObjectValue(items) ? items : {};
    return createOptions(ctx, config, uiOption, itemSchema) ?? [];
  });
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle
  useLabel={false}
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
>
  <Widget
    type="widget"
    {handlers}
    {config}
    {errors}
    bind:value
    {options}
    {uiOption}
  />
</Template>
