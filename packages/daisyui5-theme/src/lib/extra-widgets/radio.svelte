<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption } from "@sjsf/form/options.svelte";
  import "@sjsf/basic-theme/extra-widgets/radio.svelte";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapper,
    errors,
    mapped = singleOption({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "radio", handlers, { type: "radio" })
  );
</script>

{#each options as option (option.id)}
  <label class="fieldset-label">
    <input
      class={["radio", errors.length > 0 && "radio-error"]}
      bind:group={mapped.current}
      value={option.mappedValue}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
