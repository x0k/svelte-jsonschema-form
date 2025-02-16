<script lang="ts">
  import { fileToDataURL } from "@sjsf/form/lib/file";
  import { asyncProxy } from "@sjsf/form/lib/svelte.svelte";

  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    addFile,
    getComponent,
    type ComponentProps,
  } from "@sjsf/form";

  let { config, value = $bindable() }: ComponentProps["fileField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "fileWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const files = asyncProxy(
    async (isRegOnly, signal) => {
      if (!value || isRegOnly) {
        return;
      }
      const data = new DataTransfer();
      await addFile(ctx, signal, data, value);
      return data.files;
    },
    async (v, signal) => {
      if (v === undefined || v.length === 0) {
        value = undefined;
        return;
      }
      try {
        value = await fileToDataURL(signal, v[0]!);
      } catch (e) {
        console.error("Failed to read file", e);
      }
    },
    (v) => v
  );

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget
    bind:value={files.value}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {handlers}
    {errors}
    {config}
    multiple={false}
  />
</Template>
