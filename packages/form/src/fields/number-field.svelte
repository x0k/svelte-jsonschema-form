<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
  } from "@/form/index.js";

  import type { FieldProps } from "./fields.js";

  const ctx = getFormContext();

  let { value = $bindable(), config }: FieldProps<"number"> = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "numberWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value =
        v === null ? (config.uiOptions?.emptyValue as number | undefined) : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template {errors} showTitle value={redacted.value} {config}>
  <Widget {config} {errors} bind:value={redacted.value} {handlers} />
</Template>
