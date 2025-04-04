<script lang="ts" module>
  declare module "../form/index.js" {
    interface UiOptions {
      numberEmptyValue?: number;
    }
  }
</script>

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

  let { value = $bindable(), config }: ComponentProps["numberField"] = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "numberWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

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
  <Widget
    type="widget"
    {config}
    {errors}
    bind:value={
      () => value,
      (v) => (value = v === undefined ? config.uiOptions?.numberEmptyValue : v)
    }
    {handlers}
  />
</Template>
