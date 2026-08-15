<script lang="ts">
  import { CheckboxList, CheckboxListItem } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { multipleOptions, idMapper } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/extra-widgets/checkboxes.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
    mapped = multipleOptions({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["checkboxesWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "checkboxes", {})
  );
</script>

<CheckboxList
  label={config.title ?? "Checkboxes"}
  value={mapped.current}
  onChange={(v: string[]) => {
    mapped.current = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
>
  {#each options as option (option.id)}
    <CheckboxListItem
      label={option.label}
      value={option.mappedValue ?? option.id}
      isDisabled={option.disabled}
    />
  {/each}
</CheckboxList>
