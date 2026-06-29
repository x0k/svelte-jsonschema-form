<script lang="ts" module>
  declare module "./components.js" {
    interface ButtonTypes {
      expand: {};
    }
  }
</script>

<script lang="ts">
  import {
    FIELD_EXPANDED,
    Text,
    getComponent,
    getFieldErrors,
    getFormContext,
    setFieldState,
    type ComponentProps,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    config,
    uiOption,
    translate,
  }: ComponentProps["expandField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Button = $derived(getComponent(ctx, "button", config));

  const errors = $derived(getFieldErrors(ctx, config.path));
</script>

<Template
  type="template"
  showTitle
  useLabel={false}
  widgetType="expandField"
  {uiOption}
  {errors}
  {value}
  {config}
>
  <Button
    type="expand"
    {errors}
    {config}
    disabled={false}
    onclick={() => {
      setFieldState(ctx, config.path, FIELD_EXPANDED);
    }}
  >
    <Text {config} id="expand" {translate} />
  </Button>
</Template>
