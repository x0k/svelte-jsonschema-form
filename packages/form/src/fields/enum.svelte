<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    createPseudoId,
    createOptions2,
    getComponent,
  } from "@/form/index.js";
  import type { FieldProps } from "./fields.js";

  let { config, value = $bindable() }: FieldProps<"enum"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "selectWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const options = $derived(
    createOptions2(config.schema, config.uiSchema, config.uiOptions, (i) =>
      createPseudoId(ctx, config.id, i)
    ) ?? []
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget {handlers} {config} {errors} bind:value {options} />
</Template>
