<script lang="ts">
  import {
    getTemplate,
    getWidget,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    makePseudoId,
    createOptions2,
    type FieldProps,
  } from "@/form/index.js";

  let {
    config,
    value = $bindable(),
    itemSchema,
  }: FieldProps<"multiEnum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "multiSelect", config));

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
