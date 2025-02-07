<script lang="ts">
  import { fileToDataURL } from "@/lib/file.js";
  import { asyncProxy } from "@/lib/svelte.svelte";

  import {
    getWidget,
    getTemplate,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    addFiles,
    type FieldProps,
  } from "@/form/index.js";

  let { config, value = $bindable() }: FieldProps<"files"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "file", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const files = asyncProxy(
    async (isRegOnly, signal) => {
      if (!value || isRegOnly) {
        return;
      }
      const data = new DataTransfer();
      await addFiles(ctx, signal, data, value);
      return data.files;
    },
    async (v, signal) => {
      if (v === undefined || v.length === 0) {
        value = [];
        return;
      }
      try {
        value = await Promise.all(
          Array.from(v).map((f) => fileToDataURL(signal, f))
        );
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
    {handlers}
    {errors}
    {config}
    multiple
  />
</Template>
