<script lang="ts" module>
  const field = "nativeFileField";
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
    getFieldAction,
  } from "@/form/index.js";
  import "@/form/extra-fields/native-file.js";

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

  const errors = $derived(getFieldErrors(ctx, config.path));

  const setValue = createTask({
    combinator: abortPrevious,
    async execute(signal, files: FileList | undefined) {
      if (files === undefined || files.length === 0) {
        return undefined;
      }
      if (!(await validateFileList(signal, ctx, config, files))) {
        throw new FileListValidationError();
      }
      return files[0]!;
    },
    onSuccess(file: File | undefined) {
      value = file;
    },
  });
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
    bind:value={
      BROWSER
        ? () => {
            const v = value;
            const t = new DataTransfer();
            if (v) {
              t.items.add(v);
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
    multiple={false}
  />
</Template>
