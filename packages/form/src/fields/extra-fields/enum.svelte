<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/enum.js";

  import { createOptions } from "../enum.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["enumField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () => config, () =>
    validateField(ctx, config, value)
  );
  const options = $derived(
    createOptions(ctx, config, uiOption, config.schema) ?? []
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle
  useLabel
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
    {uiOption}
    bind:value
    {options}
  />
</Template>
