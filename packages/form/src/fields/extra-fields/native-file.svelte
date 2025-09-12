<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      fileWidget: {};
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
  import "@/form/extra-fields/native-file.js";

  import "../extra-widgets/file.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["nativeFileField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "fileWidget";
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
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
>
  <Widget
    type="widget"
    bind:value={
      () => {
        const v = value;
        if (v === undefined) {
          return v;
        }
        const t = new DataTransfer();
        t.items.add(v);
        return t.files;
      },
      (v) => (value = v?.item(0) ?? undefined)
    }
    processing={false}
    loading={false}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple={false}
  />
</Template>
