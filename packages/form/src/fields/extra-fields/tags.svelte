<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      tagsWidget: {};
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

  import "../extra-widgets/tags.js";

  let { config, value = $bindable() }: ComponentProps["tagsField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "tagsWidget";
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
  <Widget type="widget" bind:value {handlers} {errors} {config} />
</Template>
