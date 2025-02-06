<script lang="ts">
  import {
    getTemplate,
    getWidget,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
  } from "../context/index.js";

  import type { FieldProps } from "./model.js";

  const ctx = getFormContext();

  let { value = $bindable(), config }: FieldProps<"number"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "number", config));

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

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {errors} showTitle value={redacted.value} {config}>
  <Widget
    options={[]}
    {config}
    {errors}
    bind:value={redacted.value}
    {handlers}
  />
</Template>
