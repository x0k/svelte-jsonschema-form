<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";

  const ctx = getFormContext();

  let { config, value = $bindable() }: ComponentProps["booleanField"] =
    $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "checkboxWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  type="template"
  showTitle={config.uiOptions?.hideTitle === false}
  useLabel
  {widgetType}
  {config}
  {value}
  {errors}
>
  <Widget type="widget" bind:value {errors} {handlers} {config} />
</Template>
