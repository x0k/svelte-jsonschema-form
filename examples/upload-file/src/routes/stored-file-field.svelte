<script lang="ts" module>
  declare module "@sjsf/form" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
</script>

<script lang="ts">
  import { createAsyncBinding } from "@sjsf/form/lib/svelte.svelte";
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
  } from "@sjsf/form";

  import "@sjsf/form/fields/extra-widgets/file";

  import { getStoreContext } from "./context";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["stringField"] = $props();

  const ctx = getFormContext();
  const storeCtx = getStoreContext();

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
      if (value !== undefined) {
        data.items.add(await storeCtx.retrieveFile(signal, value));
      }
      return data.files;
    },
    async toInput(signal, files) {
      return files === undefined || files.length === 0
        ? undefined
        : await storeCtx.storeFile(signal, files[0]!);
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

<style>
  /* Show a spinner or subtle overlay when the input is uploading/loading */
  :global([type="file"][data-loading="true"]) {
    position: relative;
    cursor: wait; /* show busy cursor */
  }

  /* Add a pseudo-element for visual indicator */
  :global([type="file"][data-loading="true"]::after) {
    content: "⏳"; /* hourglass emoji for loading */
    position: absolute;
    top: 50%;
    right: 0.5em;
    transform: translateY(-50%);
    pointer-events: none; /* don't block clicks */
    font-size: 1.2em;
  }

  /* Show processing state separately */
  :global([type="file"][data-processing="true"]) {
    position: relative;
    cursor: progress; /* indicates active work */
  }

  /* Optional: pseudo-element for processing indicator */
  :global([type="file"][data-processing="true"]::after) {
    content: "⚙️"; /* gear emoji for processing */
    position: absolute;
    top: 50%;
    right: 0.5em;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.2em;
    animation: spin 1s linear infinite; /* spinning gear effect */
  }

  :global(
    input[type="file"][data-loading="true"],
    input[type="file"][data-processing="true"]
  ) {
    pointer-events: none; /* block clicks */
    opacity: 0.6; /* visually dim */
    cursor: not-allowed; /* show forbidden cursor */
  }

  /* Simple spin animation */
  @keyframes spin {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
</style>
