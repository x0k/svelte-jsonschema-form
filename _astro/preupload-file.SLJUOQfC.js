const n=`<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";

  import Form from "./form.svelte";

  const files = new SvelteSet<string>();
  onMount(async () => {
    const root = await navigator.storage.getDirectory();
    for await (const [name, handle] of root) {
      if (handle.kind === "file") {
        files.add(name);
      }
    }
  });
<\/script>

<p>Open form with uploaded file:</p>
<div style="display: flex; gap: 1rem; padding-bottom: 1rem;">
  {#each files as f (f)}
    <a href={f}>{f}</a>
  {:else}
    <p>Upload at least 1 file</p>
  {/each}
</div>

<Form onFileCreated={(key) => files.add(key)} />
`,e=`<script lang="ts">
  import Form from "../form.svelte";

  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();
<\/script>

<Form initialValue={{ file: params.id }} />
`,t=`import { createContext } from "svelte";

export interface StoreContext {
  storeFile: (signal: AbortSignal, file: File) => Promise<string>;
  retrieveFile: (signal: AbortSignal, key: string) => Promise<File>;
}

export const [getStoreContext, setStoreContext] = createContext<StoreContext>();
`,i=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import StoredFileField from "./stored-file-field.svelte";
  import { setStoreContext } from "./context";

  const {
    initialValue,
    onFileCreated,
  }: {
    initialValue?: { file: string };
    onFileCreated?: (key: string) => void;
  } = $props();

  const schema = {
    type: "object",
    title: "File form",
    properties: {
      file: {
        title: "File",
        type: "string",
      },
    },
    required: ["file"],
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    file: {
      "ui:components": {
        stringField: StoredFileField,
      },
    },
  };

  const form = createForm({
    ...defaults,
    get initialValue() {
      return initialValue;
    },
    schema,
    uiSchema,
    onSubmit: console.log,
  });

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setStoreContext({
    async storeFile(_, file) {
      const root = await navigator.storage.getDirectory();
      const key = file.name
      const handle = await root.getFileHandle(key, { create: true });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      await sleep(2000);
      onFileCreated?.(key);
      return key;
    },
    async retrieveFile(_, key) {
      const root = await navigator.storage.getDirectory();
      const handle = await root.getFileHandle(key);
      const file = await handle.getFile();
      await sleep(2000);
      return file;
    },
  });
<\/script>

<BasicForm {form} />
`,o=`<script lang="ts" module>
  declare module "@sjsf/form" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
<\/script>

<script lang="ts">
  import { createAsyncBinding } from "@sjsf/form/lib/svelte.svelte";
  import {
    makeEventHandlers,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    validateFileList,
    FileListValidationError,
    getFieldErrors,
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
        data.items.add(await storeCtx.retrieveFile(signal, value));
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
      return await storeCtx.storeFile(signal, files[0]!);
    },
  });

  const errors = $derived(getFieldErrors(ctx, config.path));
<\/script>

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
`,r={formDefaults:{widgets:["file"]},files:{"src/routes/+page.svelte":n,"src/routes/[id]/+page.svelte":e,"src/routes/context.ts":t,"src/routes/form.svelte":i,"src/routes/stored-file-field.svelte":o}};export{r as layer};
