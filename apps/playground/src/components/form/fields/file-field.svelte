<script lang="ts">
  import { dataURLtoBlob, fileToDataURL } from "@/lib/file";
  import { asyncProxy } from "@/lib/svelte.svelte";

  import type { SchemaArrayValue, SchemaValue } from "../schema";
  import { getFormContext } from "../context";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

  let {
    config,
    value = $bindable(),
    multiple = false,
  }: FieldProps<"file"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "file", config));

  const attributes = $derived(inputAttributes(ctx, config));

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
        return
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
          : fileToDataURL(signal, v[0]));
      } catch (e) {
        console.error("Failed to read file", e);
      }
    },
    (v) => v
  );
</script>

<Template showTitle {value} {config}>
  <Widget
    bind:value={files.value}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {attributes}
    {config}
    {multiple}
  />
</Template>
