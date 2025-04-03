<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    createPseudoId,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";
  import "@/form/extra-fields/enum.js";

  import { createOptions } from "../enum.js";

  let { config, value = $bindable() }: ComponentProps["enumField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived(
    createOptions(config.schema, config.uiSchema, config.uiOptions, (i) =>
      createPseudoId(config.id, i, ctx)
    ) ?? []
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle useLabel {widgetType} {value} {config} {errors}>
  <Widget {handlers} {config} {errors} bind:value {options} />
</Template>
