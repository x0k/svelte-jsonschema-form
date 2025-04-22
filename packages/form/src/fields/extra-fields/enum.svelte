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

  let { config, value = $bindable() }: ComponentProps["enumField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived(createOptions(ctx, config, config.schema) ?? []);
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle
  useLabel
  {widgetType}
  {value}
  {config}
  {errors}
>
  <Widget type="widget" {handlers} {config} {errors} bind:value {options} />
</Template>
