<script lang="ts">
  import { dataURLtoBlob, fileToDataURL } from "@/lib/file";
  import { createTransformation } from "@/lib/svelte.svelte";

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

  function addFile(data: DataTransfer, dataUri: SchemaValue | undefined) {
    if (typeof dataUri !== "string") {
      throw new Error("Value must be a string");
    }
    // TODO: cache this operation
    const { name, blob } = dataURLtoBlob(dataUri);
    data.items.add(new File([blob], name, { type: blob.type }));
  }

  function addFiles(data: DataTransfer, dataUris: string | SchemaArrayValue) {
    if (!Array.isArray(dataUris)) {
      throw new Error("Value must be an array of strings");
    }
    for (const dataUri of dataUris) {
      addFile(data, dataUri);
    }
  }

  let controller = new AbortController();
  let promise = $state.raw<Promise<void>>();
  const transformed = createTransformation({
    transform: (isRegOnly) => {
      if (!value || isRegOnly) {
        return;
      }
      const data = new DataTransfer();
      (multiple ? addFiles : addFile)(data, value);
      return data.files;
    },
    update(v) {
      if (v === undefined || v.length === 0) {
        value = multiple ? [] : undefined;
        return;
      }
      controller.abort();
      controller = new AbortController();
      promise = (
        multiple
          ? Promise.all(
              Array.from(v).map((f) => fileToDataURL(controller.signal, f))
            )
          : fileToDataURL(controller.signal, v[0])
      ).then(
        (v) => {
          promise = undefined;
          value = v;
        },
        (e) => {
          if (e instanceof ProgressEvent && e.type === "abort") {
            // NOTE: Do not clear `promise` state here, because
            // another promise is already in progress.
            console.warn("File read aborted");
            return;
          }
          promise = undefined;
          console.error("Failed to read file", e);
        }
      );
    },
  });
</script>

<Template showTitle {value} {config}>
  <Widget
    bind:value={transformed.value}
    loading={promise !== undefined}
    {attributes}
    {config}
    {multiple}
  />
</Template>
