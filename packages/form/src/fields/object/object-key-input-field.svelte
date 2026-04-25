<script lang="ts" module>
  import "@/form/extra-fields/object-key-input.js";
  import type { FormEnumOption } from "@/form/index.js";
  import {
    EMPTY_VALUE,
    singleOption,
    type EnumValueMapper,
  } from "@/options.svelte.js";

  const field = "objectKeyInputField";
  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
  }

  const DEFAULT_FORM_OPTIONS: {
    mapper: EnumValueMapper;
    options: FormEnumOption[];
  } = {
    mapper: {
      fromValue: () => EMPTY_VALUE,
      toValue: () => undefined,
    },
    options: [],
  };
</script>

<script lang="ts">
  import {
    getComponent,
    getFieldErrors,
    getFormContext,
    isSelect,
    retrieveUiOption,
    type ComponentProps,
    type UiOption,
    getFieldAction,
  } from "@/form/index.js";

  import { createFormOptions } from "../enum.js";
  import { getObjectContext } from "./context.svelte.js";

  let {
    config,
    value = $bindable(),
    uiOption: fieldUiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();
  const objCtx = getObjectContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = $derived(
    isSelect(ctx, config.schema) ? "selectWidget" : "textWidget"
  );
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const errors = $derived(getFieldErrors(ctx, config.path));
  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config, opt);

  const { options, mapper } = $derived(
    widgetType === "selectWidget"
      ? createFormOptions(ctx, config, fieldUiOption, config.schema)
      : DEFAULT_FORM_OPTIONS
  );
  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => {
      if (v !== undefined && typeof v !== "string") {
        throw new Error(
          `Expected "string | undefined" key input value type, but got "${typeof v}"`
        );
      }
      value = v;
    },
  });

  const availableOptions = $derived(
    options.filter(
      (o) =>
        o.value === value ||
        (typeof o.value === "string" && objCtx.isAvailablePropertyKey(o.value))
    )
  );

  let writable = $derived(value);
  const handlers = {
    onchange: () => {
      value = writable;
    },
  };

  const action = $derived(getFieldAction(ctx, config, field));
</script>

{#snippet renderAction()}
  {@render action?.(
    ctx,
    config,
    {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    errors
  )}
{/snippet}
<Template
  type="template"
  showTitle
  useLabel
  {widgetType}
  value={writable}
  {config}
  {errors}
  {uiOption}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {errors}
    {handlers}
    {config}
    {uiOption}
    bind:value={writable as undefined}
    options={availableOptions}
    {mapper}
    {mapped}
    clearable={false}
    hasInitialValue={true}
  />
</Template>
