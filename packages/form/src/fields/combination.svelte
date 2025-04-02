<script lang="ts" module>
  import type { UiSchema } from "@/form/index.js";

  declare module "../form/index.js" {
    interface UiSchemaContent {
      combinationFieldOptionSelector?: UiSchema;
    }
  }
</script>

<script lang="ts">
  import { untrack } from "svelte";

  import {
    ANY_OF_KEY,
    getDiscriminatorFieldFromSchema,
    getSimpleSchemaType,
    ONE_OF_KEY,
    type EnumOption,
  } from "@/core/index.js";
  import {
    type Config,
    getClosestMatchingOption,
    getDefaultFieldState,
    getErrors,
    getUiOptions,
    retrieveSchema,
    sanitizeDataForNewSchema,
    getFormContext,
    createPseudoId,
    getComponent,
    type ComponentProps,
    translate,
    getFieldComponent,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    config,
    combinationKey,
  }: ComponentProps["anyOfField" | "oneOfField"] & {
    combinationKey: typeof ONE_OF_KEY | typeof ANY_OF_KEY;
  } = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "multiFieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "selectWidget", config));

  const restFieldConfig = $derived.by(() => {
    const { [combinationKey]: _, ...restSchema } = config.schema;
    const restSchemaType = getSimpleSchemaType(restSchema);
    return restSchemaType !== "null"
      ? {
          ...config,
          schema: restSchema,
        }
      : null;
  });
  const RestSchemaField = $derived(
    restFieldConfig && getFieldComponent(ctx, restFieldConfig)
  );
  const retrievedOptions = $derived(
    (config.schema[combinationKey] ?? []).map((s) =>
      typeof s !== "boolean" ? retrieveSchema(ctx, s, value) : {}
    )
  );

  let readableSelectedOption = $state(0);
  let writableSelectedOption = $derived(
    getClosestMatchingOption(
      ctx,
      value,
      retrievedOptions,
      readableSelectedOption,
      getDiscriminatorFieldFromSchema(config.schema)
    )
  );
  $effect(() => {
    const nextSelected = writableSelectedOption;
    if (readableSelectedOption === nextSelected) {
      return;
    }
    value = untrack(() => {
      const nextSchema = retrievedOptions[nextSelected];
      if (nextSchema === undefined) {
        return undefined;
      }
      const oldSchema = retrievedOptions[readableSelectedOption];
      return getDefaultFieldState(
        ctx,
        nextSchema,
        oldSchema !== undefined
          ? sanitizeDataForNewSchema(ctx, nextSchema, oldSchema, value)
          : value
      );
    });
    readableSelectedOption = nextSelected;
  });

  const optionsUiSchemas = $derived.by(() => {
    const schemas = config.uiSchema[combinationKey];
    return Array.isArray(schemas) ? schemas : [];
  });
  const optionsUiOptions = $derived(
    optionsUiSchemas.map((s) => getUiOptions(ctx, s))
  );

  const enumOptionLabel = $derived.by(() => {
    const title = config.uiOptions?.title ?? config.schema.title;
    return title !== undefined
      ? (index: number) =>
          translate(ctx, "multi-schema-option-label-with-title", {
            index,
            title,
          })
      : (index: number) =>
          translate(ctx, "multi-schema-option-label", { index });
  });
  const enumOptions = $derived<EnumOption<number>[]>(
    retrievedOptions.map((s, i) => ({
      id: createPseudoId(config.id, i, ctx),
      label: optionsUiOptions[i]?.title ?? s.title ?? enumOptionLabel(i),
      value: i,
      disabled: false,
    }))
  );

  const widgetConfig: Config = $derived.by(() => {
    const suffix = combinationKey.toLowerCase() as Lowercase<
      typeof combinationKey
    >;
    const uiSchema = config.uiSchema.combinationFieldOptionSelector ?? {};
    const uiOptions = getUiOptions(ctx, uiSchema);
    return {
      id: createPseudoId(config.id, suffix, ctx),
      name: `${config.name}__${suffix}`,
      required: true,
      title: config.title,
      schema: { type: "integer", default: 0 },
      uiSchema,
      uiOptions,
    };
  });
  const errors = $derived(getErrors(ctx, config.id));

  const combinationFieldConfig = $derived.by(() => {
    const selected = readableSelectedOption;
    if (selected < 0) {
      return null;
    }
    const schema = retrievedOptions[selected]!;
    const { required } = config.schema;
    const optionSchema = required
      ? {
          ...schema,
          required: schema.required
            ? required.concat(schema.required)
            : required,
        }
      : schema;
    const optionUiSchema =
      selected < optionsUiSchemas.length
        ? optionsUiSchemas[selected]!
        : config.uiSchema;
    return {
      id: config.id,
      name: config.name,
      required: config.required,
      title: "",
      schema: optionSchema,
      uiSchema: optionUiSchema,
      uiOptions: getUiOptions(ctx, optionUiSchema),
    };
  });

  const CombinationField = $derived(
    combinationFieldConfig && getFieldComponent(ctx, combinationFieldConfig)
  );
</script>

{#if restFieldConfig}
  <RestSchemaField bind:value={value as undefined} config={restFieldConfig} />
{/if}
<Template {config} {value} {errors}>
  {#snippet optionSelector()}
    <Widget
      {errors}
      handlers={{}}
      config={widgetConfig}
      options={enumOptions}
      bind:value={
        () => readableSelectedOption, (v) => (writableSelectedOption = v)
      }
    />
  {/snippet}
  {#if combinationFieldConfig}
    <CombinationField
      bind:value={value as undefined}
      config={combinationFieldConfig}
    />
  {/if}
</Template>
