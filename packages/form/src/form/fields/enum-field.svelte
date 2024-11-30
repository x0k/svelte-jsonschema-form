<script lang="ts">
  import { createOptions2 } from "../enum.js";
  import {
    getTemplate,
    getWidget,
    selectAttributes,
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    makePseudoId,
  } from "../context/index.js";

  import type { FieldProps } from "./model.js";

  let { config, value = $bindable(), multiple }: FieldProps<"enum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "select", config));

  const handlers = makeEventHandlers(ctx, () => validateField(ctx, config, value));
  const attributes = $derived(selectAttributes(ctx, config, handlers));
  const options = $derived(
    createOptions2(
      multiple ?? config.schema,
      config.idSchema,
      config.uiOptions,
      (i) => makePseudoId(ctx, config.idSchema.$id, i)
    ) ?? []
  );
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget
    {attributes}
    {config}
    {errors}
    bind:value
    {options}
    multiple={multiple !== undefined}
  />
</Template>
