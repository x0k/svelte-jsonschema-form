<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/date-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      datePicker?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    Datalist,
    getFormContext,
    inputAttributes,
    retrieveAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    retrieveAttributes(ctx, config, "datePicker", inputAttributes(handlers))
  );
</script>

<input type="date" bind:value style="flex-grow: 1" {...attributes} />
<Datalist id={attributes.list} {config} />
