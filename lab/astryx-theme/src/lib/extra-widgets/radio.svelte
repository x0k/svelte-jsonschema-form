<script lang="ts">
  import { RadioList, RadioListItem } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/extra-widgets/radio.svelte";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(customInputAttributes(ctx, config, "radio", {}));
</script>

<RadioList
  label={config.title ?? "Radio"}
  value={mapped.current ?? ""}
  onChange={(v: string) => {
    mapped.current = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
>
  {#each options as option (option.id)}
    <RadioListItem
      label={option.label}
      value={option.mappedValue ?? option.id}
      isDisabled={option.disabled}
    />
  {/each}
</RadioList>
