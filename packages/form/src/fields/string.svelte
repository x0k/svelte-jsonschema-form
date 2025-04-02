<script lang="ts" module>
  declare module "../form/index.js" {
    interface UiOptions {
      stringEmptyValue?: string;
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

  let { config, value = $bindable() }: ComponentProps["stringField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "textWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {widgetType} {value} {config} {errors}>
  <Widget
    {config}
    bind:value={
      () => value,
      (v) => (value = v === "" ? config.uiOptions?.stringEmptyValue : v)
    }
    {handlers}
    {errors}
  />
</Template>
