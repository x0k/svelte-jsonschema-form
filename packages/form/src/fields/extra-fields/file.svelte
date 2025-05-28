<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
</script>

<script lang="ts">
  import { untrack } from "svelte";

  import { fileToDataURL } from "@/lib/file.js";
  import { abortPrevious, createAction } from "@/lib/action.svelte.js";
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    addFile,
    getComponent,
    type ComponentProps,
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

  let lastValueUpdate: string | undefined;
  const toValue = createAction({
    combinator: abortPrevious,
    async execute(
      signal,
      files: FileList | undefined
    ) {
      return files === undefined || files.length === 0
        ? undefined
        : fileToDataURL(signal, files[0]!);
    },
    onSuccess(result: string | undefined) {
      lastValueUpdate = result;
      value = result;
    },
  });

  let files = $state.raw<FileList>();
  const toFiles = createAction({
    combinator: abortPrevious,
    async execute(signal, value: string | undefined) {
      const data = new DataTransfer();
      if (value !== undefined) {
        await addFile(ctx, signal, data, value);
      }
      return data.files;
    },
    onSuccess(list: FileList) {
      files = list;
    },
  });

  $effect(() => {
    if (value === lastValueUpdate) {
      return;
    }
    untrack(() => {
      toValue.abort();
      toFiles.run(value);
    });
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
    bind:value={
      () => files,
      (files) => {
        toFiles.abort();
        toValue.run(files);
      }
    }
    processing={toValue.isProcessed}
    loading={toFiles.isProcessed}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple={false}
  />
</Template>
