<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
</script>

<script lang="ts">
  import { fileToDataURL } from "@/lib/file.js";
  import { createAsyncBinding } from "@/lib/svelte.svelte.js";
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

  const files = createAsyncBinding({
    initialOutput: undefined,
    getInput: () => value,
    setInput: (v) => (value = v),
    isEqual: (a, b) =>
      // WARN: Do not optimize, avoid svelte reactive value equality warning
      (a === undefined && b === undefined) ||
      (Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((v, i) => v === b[i])),
    async toOutput(signal, value) {
      const data = new DataTransfer();
      if (value !== undefined) {
        await addFiles(ctx, signal, data, value);
      }
      return data.files;
    },
    async toInput(signal, files) {
      return (
        files &&
        Promise.all(Array.from(files).map((f) => fileToDataURL(signal, f)))
      );
    },
  });

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
    bind:value={files.current}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple
  />
</Template>
