<script lang="ts">
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
    onFileCreation,
  }: {
    initialValue?: { file: string };
    onFileCreation?: (key: string) => void;
  } = $props();

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      file: {
        title: "Hello",
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
      onFileCreation?.(key);
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
</script>

<BasicForm {form} />
