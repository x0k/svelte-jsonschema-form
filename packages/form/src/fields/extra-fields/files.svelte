<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
</script>

<script lang="ts">
  import { fileToDataURL } from "@/lib/file.js";
  import { asyncProxy } from "@/lib/svelte.svelte";
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    addFiles,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/files.js";

  import "../extra-widgets/file.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["filesField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "fileWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const files = asyncProxy(
    async (isRegOnly, signal) => {
      if (!value || isRegOnly) {
        return;
      }
      const data = new DataTransfer();
      await addFiles(ctx, signal, data, value);
      return data.files;
    },
    async (v, signal) => {
      if (v === undefined || v.length === 0) {
        value = [];
        return;
      }
      try {
        value = await Promise.all(
          Array.from(v).map((f) => fileToDataURL(signal, f))
        );
      } catch (e) {
        console.error("Failed to read file", e);
      }
    },
    (v) => v
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
    bind:value={files.value}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple
  />
</Template>
