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

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "text", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value =
        v === "" ? (config.uiOptions?.emptyValue as string | undefined) : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget
    options={[]}
    {errors}
    {config}
    bind:value={redacted.value}
    {handlers}
  />
</Template>
