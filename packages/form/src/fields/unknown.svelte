<script lang="ts">
  import {
    getComponent,
    getFieldErrors,
    getFormContext,
    type ComponentProps,
    ErrorMessage,
  } from "@/form/index.js";

  const {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["unknownField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));

  const errors = $derived(getFieldErrors(ctx, config.path));
</script>

<Template
  type="template"
  showTitle
  useLabel={false}
  widgetType="unknownField"
  {uiOption}
  {errors}
  {config}
  value={undefined}
>
  <ErrorMessage
    message={translate("unknown-field-error", { schema: config.schema })}
  />
</Template>
