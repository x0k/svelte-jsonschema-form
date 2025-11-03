<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/checkboxes";

  declare module "@sjsf/form" {
    interface UiOptions {
      checkboxes?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
  }: ComponentProps["checkboxesWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "checkboxes", handlers, {
      type: "checkbox",
    })
  );

  const mapped = multipleOptions({
    mapper: () => idMapper(options),
    value: () => value,
    update: (v) => (value = v),
  });
</script>

{#each options as option (option.id)}
  <label class="sjsf-checkboxes">
    <input
      bind:group={mapped.value}
      value={option.id}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
