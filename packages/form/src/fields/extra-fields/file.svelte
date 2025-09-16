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
    addFile,
    getComponent,
    type ComponentProps,
    validateFileList,
    FileListValidationError,
  } from "@/form/index.js";
  import "@/form/extra-fields/file.js";

  import "../extra-widgets/file.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["fileField"] = $props();

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
    async toOutput(signal, value) {
      const data = new DataTransfer();
      if (value) {
        await addFile(ctx, signal, data, value);
      }
      return data.files;
    },
    async toInput(signal, files) {
      if (files === undefined || files.length === 0) {
        return undefined;
      }
      if (!(await validateFileList(signal, ctx, config, files))) {
        throw new FileListValidationError();
      }
      return fileToDataURL(signal, files[0]!);
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
    multiple={false}
  />
</Template>
