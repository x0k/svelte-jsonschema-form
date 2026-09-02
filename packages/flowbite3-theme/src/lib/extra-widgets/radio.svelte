<script lang="ts" module>
  import type { RadioProps } from "flowbite-svelte/types";
  import "@sjsf/form/fields/extra-widgets/radio";

  declare module "@sjsf/form" {
    interface UiOptions {
      flowbite3Radio?: RadioProps<number>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption } from "@sjsf/form/options.svelte";
  import Radio from "flowbite-svelte/Radio.svelte";

  let {
    value = $bindable(),
    options,
    mapper,
    config,
    handlers,
    mapped = singleOption({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "flowbite3Radio", handlers, {})
  );
</script>

{#each options as option (option.id)}
  <Radio
    bind:group={mapped.current}
    value={option.mappedValue}
    {...attributes}
    id={option.id}
    disabled={option.disabled || attributes.disabled}
  >
    {option.label}
  </Radio>
{/each}
