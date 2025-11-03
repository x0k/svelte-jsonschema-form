<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      checkbox?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "checkbox", handlers, { type: "checkbox" })
  );
</script>

<label class="basic-checkbox" >
  <input
    type="checkbox"
    bind:checked={() => value ?? false, (v) => (value = v)}
    {...attributes}
  />
  {config.title}
</label>
