<script lang="ts">
  import { TextInput } from "@astryx-svelte/core";
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/widgets/text.svelte";

  let {
    handlers,
    value = $bindable(),
    config,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "text", handlers, { type: "text" })
  );
</script>

<TextInput
  label={config.title ?? "Text"}
  bind:value={() => value ?? "", (v) => (value = v || undefined)}
  type="text"
  isDisabled={attributes.disabled === true}
  isRequired={attributes.required === true}
  isLabelHidden
/>
{#if attributes.list}
  <Datalist id={attributes.list} {config} />
{/if}
