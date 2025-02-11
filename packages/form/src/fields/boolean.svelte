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

  let { config, value = $bindable() }: FieldProps<"boolean"> = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "checkboxWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  {errors}
  showTitle={config.uiOptions?.hideTitle === false}
  {value}
  {config}
>
  <Widget bind:value {errors} {handlers} {config} />
</Template>
