<script lang="ts">
  import { FileInput } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/extra-widgets/file.svelte";

  let {
    config,
    handlers,
    multiple,
    loading,
    processing,
    value = $bindable(),
  }: ComponentProps["fileWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(customInputAttributes(ctx, config, "file", {}));

  function toFileOrNull(v: FileList | undefined): File | null {
    if (!v || v.length === 0) return null;
    return v[0];
  }
</script>

<FileInput
  label={config.title ?? "File"}
  value={toFileOrNull(value)}
  onChange={(v: File | File[] | null) => {
    if (v === null) {
      value = undefined;
    } else if (Array.isArray(v)) {
      value = v as any;
    } else {
      value = [v] as any;
    }
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isMultiple={multiple}
  isDisabled={attributes.disabled === true || loading || processing}
/>
