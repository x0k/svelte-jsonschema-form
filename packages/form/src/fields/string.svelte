<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    NO_OPTIONS,
  } from "@/form/index.js";

  import type { FieldProps } from "./fields.js";
  import { getWidget } from "./widgets.js";

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getWidget(ctx, "textWidget", config));

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

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget
    options={NO_OPTIONS}
    {errors}
    {config}
    bind:value={redacted.value}
    {handlers}
  />
</Template>
