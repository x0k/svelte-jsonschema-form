<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  let { type, value = $bindable(), config }: ComponentProps["integerField"] =
    $props();

  const ctx = getFormContext();

  const Field = $derived(getComponent(ctx, "numberField", config));

  const integer = {
    get value() {
      return value;
    },
    set value(v) {
      if (!Number.isInteger(v) && v !== config.uiOptions?.numberEmptyValue) {
        return;
      }
      value = v;
    },
  };
</script>

<Field {type} bind:value={integer.value} {config} />
