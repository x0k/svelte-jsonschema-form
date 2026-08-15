<script lang="ts">
  import { TextArea } from "@astryx-svelte/core";
  import {
    getFormContext,
    textareaAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/extra-widgets/textarea.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textareaWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    textareaAttributes(ctx, config, "textarea", handlers, {})
  );
</script>

<TextArea
  label={config.title || "Textarea"}
  bind:value={() => value ?? "", (v) => (value = v || undefined)}
  isDisabled={attributes.disabled === true}
  isRequired={attributes.required === true}
  isLabelHidden
  rows={4}
/>
