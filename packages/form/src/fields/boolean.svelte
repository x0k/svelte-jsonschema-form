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
  showTitle={config.uiOptions?.hideTitle === false}
  {widgetType}
  {config}
  {value}
  {errors}
>
  <Widget bind:value {errors} {handlers} {config} />
</Template>
