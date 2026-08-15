<script lang="ts">
  import { NumberInput } from "@astryx-svelte/core";
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/widgets/number.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "number", handlers, { type: "number" })
  );
</script>

<NumberInput
  label={config.title ?? "Number"}
  value={value ?? null}
  onChange={(v: number | null) => {
    value = v ?? undefined;
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
  isRequired={attributes.required === true}
  isLabelHidden
  min={typeof config.schema?.minimum === "number"
    ? config.schema.minimum
    : null}
  max={typeof config.schema?.maximum === "number"
    ? config.schema.maximum
    : null}
  step={typeof config.schema?.multipleOf === "number"
    ? config.schema.multipleOf
    : null}
/>
{#if attributes.list}
  <Datalist id={attributes.list} {config} />
{/if}
