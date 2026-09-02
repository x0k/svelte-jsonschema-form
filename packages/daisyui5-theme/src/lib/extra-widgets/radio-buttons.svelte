<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/radio-buttons";

  declare module "@sjsf/form" {
    interface UiOptions {
      daisyui5RadioButtons?: HTMLInputAttributes;
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
  }: ComponentProps["radioButtonsWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "daisyui5RadioButtons", handlers, {
      type: "radio",
    })
  );
</script>

<div class="join">
  {#each options as option (option.id)}
    <input
      class={["join-item btn", errors.length > 0 && "btn-error"]}
      bind:group={mapped.current}
      value={option.mappedValue}
      aria-label={option.label}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
  {/each}
</div>
