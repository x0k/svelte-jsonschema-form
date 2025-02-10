<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    makePseudoId,
    createOptions2,
    getComponent,
  } from "@/form/index.js";

  import type { FieldProps } from "./fields.js";
  import { getWidget } from "./widgets.js";

  let {
    config,
    value = $bindable(),
    itemSchema,
  }: FieldProps<"multiEnum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getWidget(ctx, "multiSelectWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived(
    createOptions2(itemSchema, config.idSchema, config.uiOptions, (i) =>
      makePseudoId(ctx, config.idSchema.$id, i)
    ) ?? []
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget {handlers} {config} {errors} bind:value {options} />
</Template>
