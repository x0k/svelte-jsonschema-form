<script lang="ts">
  import { makeDataURLtoBlob, fileToDataURL } from "@/lib/file.js";
  import { asyncProxy } from "@/lib/svelte.svelte";
  import type { SchemaArrayValue, SchemaValue } from "@/core/index.js";

  import {
    getWidget,
    getTemplate,
    inputAttributes,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
  } from "../context/index.js";

  import type { FieldProps } from "./model.js";

  let {
    config,
    value = $bindable(),
    multiple
  }: FieldProps<"file"> = $props();

  const ctx = getFormContext();
  const dataURLtoBlob = $derived(makeDataURLtoBlob(ctx.schedulerYield));

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "file", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const attributes = $derived(inputAttributes(ctx, config, handlers));

  async function addFile(
    signal: AbortSignal,
    data: DataTransfer,
    dataUri: SchemaValue | undefined
  ) {
    if (typeof dataUri !== "string") {
      throw new Error("Value must be a string");
    }
    // TODO: cache this operation
    const { name, blob } = await dataURLtoBlob(signal, dataUri);
    data.items.add(new File([blob], name, { type: blob.type }));
  }

  function addFiles(
    signal: AbortSignal,
    data: DataTransfer,
    dataUris: string | SchemaArrayValue
  ) {
    if (!Array.isArray(dataUris)) {
      throw new Error("Value must be an array of strings");
    }
    const promises: Promise<void>[] = [];
    for (const dataUri of dataUris) {
      promises.push(addFile(signal, data, dataUri));
    }
    return Promise.all(promises);
  }

  const files = asyncProxy(
    async (isRegOnly, signal) => {
      if (!value || isRegOnly) {
        return;
      }
      const data = new DataTransfer();
      await (multiple ? addFiles : addFile)(signal, data, value);
      return data.files;
    },
    async (v, signal) => {
      if (v === undefined || v.length === 0) {
        value = multiple ? [] : undefined;
        return;
      }
      try {
        value = await (multiple
          ? Promise.all(Array.from(v).map((f) => fileToDataURL(signal, f)))
          : fileToDataURL(signal, v[0]!));
      } catch (e) {
        console.error("Failed to read file", e);
      }
    },
    (v) => v
  );

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget
    bind:value={files.value}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {attributes}
    {errors}
    {config}
    multiple={multiple !== undefined}
  />
</Template>
