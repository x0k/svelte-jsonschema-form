<script lang="ts" module>
  const field = "fileField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
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
    getFieldErrors,
    validateField,
    getFormContext,
    addFile,
    getComponent,
    type ComponentProps,
    validateFileList,
    FileListValidationError,
    getFieldAction,
  } from "@/form/index.js";
  import "@/form/extra-fields/file.js";

  import "../extra-widgets/file.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "fileWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
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
      const file = files[0]!
      if (!(await validateFileList(signal, ctx, config, files))) {
        throw new FileListValidationError();
      }
      return fileToDataURL(signal, file);
    },
  });

  const errors = $derived(getFieldErrors(ctx, config.path));
  const action = $derived(getFieldAction(ctx, config, field));
</script>

{#snippet renderAction()}
  {@render action?.(
    ctx,
    config,
    {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    errors
  )}
{/snippet}
<Template
  type="template"
  showTitle
  useLabel
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
  action={action && renderAction}
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
