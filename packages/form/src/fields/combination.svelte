<script lang="ts" module>
  import type { UiSchemaDefinition } from "@/form/index.js";

  declare module "../form/index.js" {
    interface UiSchemaContent {
      combinationFieldOptionSelector?: UiSchemaDefinition;
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
    retrieveSchema,
    sanitizeDataForNewSchema,
    getFormContext,
    createPseudoId,
    getComponent,
    type ComponentProps,
    getFieldComponent,
    retrieveUiSchema,
    retrieveUiOption,
    uiTitleOption,
    retrieveTranslate,
  } from "@/form/index.js";

  let {
    value = $bindable(),
    config,
    combinationKey,
    uiOption,
    translate,
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
    return Array.isArray(schemas)
      ? schemas.map((s) => retrieveUiSchema(ctx, s))
      : [];
  });
  const enumOptionLabel = $derived.by(() => {
    // NOTE: We don't use `config.title` here because we don't want to use
    // the generated `item-1` type titles as the basis for the new title.
    const explicitTitle =
      uiTitleOption(ctx, config.uiSchema) ?? config.schema.title;
    return explicitTitle
      ? (index: number) =>
          translate("multi-schema-option-label-with-title", {
            index,
            title: explicitTitle,
          })
      : (index: number) => translate("multi-schema-option-label", { index });
  });
  const optionTitles = $derived.by(() => {
    const discriminator = getDiscriminatorFieldFromSchema(config.schema);
    return retrievedOptions.map((s, i) => {
      if (discriminator !== undefined) {
        const uiSchemaDefinition = optionsUiSchemas[i]?.[discriminator];
        if (
          typeof uiSchemaDefinition === "object" &&
          !Array.isArray(uiSchemaDefinition)
        ) {
          const title = uiTitleOption(
            ctx,
            retrieveUiSchema(ctx, uiSchemaDefinition)
          );
          if (title !== undefined) {
            return title;
          }
        }
        const schemaDef = s.properties?.[discriminator];
        if (schemaDef !== undefined && typeof schemaDef !== "boolean") {
          // NOTE: I don't think it's worth adding a `value` dependency here
          const { title } = retrieveSchema(ctx, schemaDef, undefined);
          if (title !== undefined) {
            return title;
          }
        }
      }
      const uiSchema = optionsUiSchemas[i];
      return (
        (uiSchema && uiTitleOption(ctx, uiSchema)) ??
        s.title ??
        enumOptionLabel(i)
      );
    });
  });

  const enumOptions = $derived<EnumOption<number>[]>(
    optionTitles.map((label, i) => ({
      id: createPseudoId(config.id, i, ctx),
      label,
      value: i,
      disabled: false,
    }))
  );

  const widgetConfig: Config = $derived.by(() => {
    const suffix = combinationKey.toLowerCase() as Lowercase<
      typeof combinationKey
    >;
    const uiSchema = retrieveUiSchema(
      ctx,
      config.uiSchema.combinationFieldOptionSelector
    );
    return {
      id: createPseudoId(config.id, suffix, ctx),
      name: `${config.name}__${suffix}`,
      title: uiTitleOption(ctx, uiSchema) ?? config.title,
      schema: { type: "integer", default: 0 },
      uiSchema,
      required: true,
    };
  });
  const errors = $derived(getErrors(ctx, config.id));

  const combinationFieldConfig: Config | null = $derived.by(() => {
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
      title: "",
      schema: optionSchema,
      uiSchema: optionUiSchema,
      required: config.required,
    };
  });

  const CombinationField = $derived(
    combinationFieldConfig && getFieldComponent(ctx, combinationFieldConfig)
  );
</script>

{#if restFieldConfig}
  <RestSchemaField
    type="field"
    bind:value={value as undefined}
    config={restFieldConfig}
    uiOption={(opt) => retrieveUiOption(ctx, restFieldConfig, opt)}
    translate={retrieveTranslate(ctx, restFieldConfig)}
  />
{/if}
<Template type="template" {config} {value} {errors} {uiOption}>
  {#snippet optionSelector()}
    <Widget
      type="widget"
      {errors}
      handlers={{}}
      config={widgetConfig}
      uiOption={(opt) => retrieveUiOption(ctx, widgetConfig, opt)}
      options={enumOptions}
      bind:value={
        () => readableSelectedOption, (v) => (writableSelectedOption = v)
      }
    />
  {/snippet}
  {#if combinationFieldConfig}
    <CombinationField
      type="field"
      bind:value={value as undefined}
      config={combinationFieldConfig}
      uiOption={(opt) => retrieveUiOption(ctx, combinationFieldConfig, opt)}
      translate={retrieveTranslate(ctx, combinationFieldConfig)}
    />
  {/if}
</Template>
