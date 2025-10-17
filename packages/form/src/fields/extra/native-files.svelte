<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
</script>

<script lang="ts">
  import { BROWSER } from "esm-env";

  import { abortPrevious, createTask } from "@/lib/task.svelte.js";
  import {
    makeEventHandlers,
    getFieldErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    validateFileList,
    FileListValidationError,
  } from "@/form/index.js";
  import "@/form/extra-fields/native-files.js";

  import "../extra-widgets/file.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["nativeFilesField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "fileWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () => config, () =>
    validateField(ctx, config, value)
  );

  const errors = $derived(getFieldErrors(ctx, config.path));

  const setValue = createTask({
    combinator: abortPrevious,
    async execute(signal, files: FileList | undefined) {
      if (files === undefined) {
        return undefined;
      }
      if (!(await validateFileList(signal, ctx, config, files))) {
        throw new FileListValidationError();
      }
      return Array.from(files);
    },
    onSuccess(file: File[] | undefined) {
      value = file;
    },
  });
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
      BROWSER
        ? () => {
            const v = value;
            const t = new DataTransfer();
            if (v) {
              for (const f of v) {
                t.items.add(f);
              }
            }
            return t.files;
          }
        : () => undefined,
      setValue.run
    }
    processing={setValue.isProcessed}
    loading={false}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple
  />
</Template>
