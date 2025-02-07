<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";
  import {
    getDiscriminatorFieldFromSchema,
    isSchemaValueDeepEqual,
    mergeSchemas,
    type EnumOption,
    type SchemaValue,
  } from "@/core/index.js";

  import {
    type Config,
    type UiSchema,
    type FieldProps,
    getTemplate,
    getWidget,
    getField,
    getClosestMatchingOption,
    getDefaultFieldState,
    getErrors,
    getUiOptions,
    retrieveSchema,
    sanitizeDataForNewSchema,
    getFormContext,
    makePseudoId,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    config,
    combinationKey,
  }: FieldProps<"multi"> = $props();

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "multi", config));
  const Field = $derived(getField(ctx, "root", config));
  const Widget = $derived(getWidget(ctx, "select", config));

  const retrievedOptions = $derived(
    (config.schema[combinationKey] ?? []).map((s) =>
      typeof s !== "boolean" ? retrieveSchema(ctx, s, undefined) : {}
    )
  );

  let lastValue: SchemaValue | undefined;
  const selectedOption = proxy(
    (isRegOnly, currentSelected: number | undefined) => {
      if (isRegOnly) {
        config.schema;
        value;
        retrievedOptions;
        return -1;
      }
      if (
        currentSelected !== undefined &&
        isSchemaValueDeepEqual(lastValue, value)
      ) {
        return currentSelected;
      }
      lastValue = $state.snapshot(value);
      return getClosestMatchingOption(
        ctx,
        value,
        retrievedOptions,
        0,
        getDiscriminatorFieldFromSchema(config.schema)
      );
    },
    (newSelected, oldSelected) => {
      if (oldSelected === undefined) {
        return;
      }
      const newSchema =
        newSelected < 0 ? undefined : retrievedOptions[newSelected];
      if (newSchema === undefined) {
        value = undefined;
        return;
      }
      const oldSchema =
        oldSelected < 0 ? undefined : retrievedOptions[oldSelected];
      value = getDefaultFieldState(
        ctx,
        newSchema,
        oldSchema !== undefined
          ? sanitizeDataForNewSchema(ctx, newSchema, oldSchema, value)
          : value
      );
    }
  );

  const optionSchema = $derived.by(() => {
    const selected = selectedOption.value;
    if (selected < 0) {
      return null;
    }
    const schema = retrievedOptions[selected]!;
    const { required } = config.schema;
    return required ? mergeSchemas({ required }, schema) : schema;
  });

  const optionsUiSchemas = $derived.by(() => {
    const schemas = config.uiSchema[combinationKey];
    return Array.isArray(schemas) ? schemas : [];
  });
  const optionsUiOptions = $derived(
    optionsUiSchemas.map((s) => getUiOptions(ctx, s))
  );

  const optionUiSchema = $derived.by<UiSchema>(() => {
    const selected = selectedOption.value;
    if (selected < 0) {
      return {};
    }
    if (selected < optionsUiSchemas.length) {
      return optionsUiSchemas[selected]!;
    }
    return config.uiSchema;
  });

  const enumOptionLabel = $derived.by(() => {
    const customTitle = config.uiOptions?.title ?? config.schema.title;
    return customTitle !== undefined
      ? (index: number) =>
          ctx.translation(
            "multi-schema-option-label-with-title",
            customTitle,
            index
          )
      : (index: number) => ctx.translation("multi-schema-option-label", index);
  });
  const enumOptions = $derived<EnumOption<number>[]>(
    retrievedOptions.map((s, i) => ({
      id: makePseudoId(ctx, config.idSchema.$id, i),
      label: optionsUiOptions[i]?.title ?? s.title ?? enumOptionLabel(i),
      value: i,
      disabled: false,
    }))
  );

  const widgetConfig: Config = $derived.by(() => {
    const suffix = combinationKey.toLowerCase() as Lowercase<
      typeof combinationKey
    >;
    return {
      ...config,
      schema: { type: "integer", default: 0 },
      name: `${config.name}__${suffix}`,
      idSchema: { $id: makePseudoId(ctx, config.idSchema.$id, suffix) },
      required: true,
    };
  });
  const errors = $derived(getErrors(ctx, config.idSchema));
</script>

<Template {config} {value} {errors}>
  {#snippet optionSelector()}
    <Widget
      {errors}
      handlers={{}}
      config={widgetConfig}
      options={enumOptions}
      bind:value={selectedOption.value}
    />
  {/snippet}
  {#if optionSchema}
    <Field
      bind:value
      config={{
        ...config,
        schema: optionSchema,
        uiSchema: optionUiSchema,
        title: "",
      }}
    />
  {/if}
</Template>
