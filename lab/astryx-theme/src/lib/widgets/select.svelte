<script lang="ts">
  import { Selector, type SelectorOptionType } from "@astryx-svelte/core";
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption, idMapper } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/widgets/select.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
    clearable = config.schema.default === undefined,
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, "select", handlers, {})
  );

  const selectorOptions: SelectorOptionType[] = $derived(
    options.map((opt) => ({
      value: opt.mappedValue ?? opt.id,
      label: opt.label,
      disabled: opt.disabled,
    }))
  );
</script>

<Selector
  label={config.title || "Select"}
  options={selectorOptions}
  value={mapped.current ?? null}
  onChange={(v: string | null) => {
    mapped.current = v ?? "";
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  hasClear={clearable}
  isLabelHidden
  isDisabled={attributes.disabled === true}
  placeholder={clearable ? "None" : "Select..."}
  variant="input"
/>
