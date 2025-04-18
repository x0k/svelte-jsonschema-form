<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      datePickerWidget: {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFormContext,
    makeEventHandlers,
    validateField,
    type ComponentProps,
  } from "@/form/index.js";

  let { config, value = $bindable() }: ComponentProps["dateField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "datePickerWidget";
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
    bind:value={
      () => {
        if (value === undefined) {
          return undefined;
        }
        return new Date(value);
      },
      (v) =>
        (value =
          v === undefined || isNaN(v.getTime())
            ? undefined
            : v.toLocaleDateString("en-CA"))
    }
    {handlers}
    {errors}
  />
</Template>
