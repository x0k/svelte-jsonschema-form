<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";
  import { getDiscriminatorFieldFromSchema, mergeSchemas } from "../schema";
  import type { UiSchema } from "../ui-schema";
  import { getClosestMatchingOption, getDefaultFormState, getUiOptions, retrieveSchema, sanitizeDataForNewSchema } from "../utils";
  import type { EnumOption } from "../enum";
  import { getWidget } from "../widgets";
  import type { Config } from "../config";
  import { computeId } from "../id-schema";
  import { getTemplate } from '../templates';

  import { getField, type FieldProps } from "./model";
  import { selectAttributes } from "./make-widget-attributes";

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

  const selectedOption = proxy((isRegOnly) => {
    if (isRegOnly) {
      config.schema;
      value;
      retrievedOptions;
      return -1;
    }
    const discriminator = getDiscriminatorFieldFromSchema(config.schema);
    return getClosestMatchingOption(
      ctx,
      value,
      retrievedOptions,
      0,
      discriminator
    );
  }, (newSelected, oldSelected) => {
    if (oldSelected === undefined) {
      return
    }
    const newSchema = newSelected < 0 ? undefined : retrievedOptions[newSelected];
    if (newSchema === undefined) {
      value = undefined
      return
    }
    const oldSchema = oldSelected < 0 ? undefined : retrievedOptions[oldSelected];
    value = getDefaultFormState(ctx, newSchema, oldSchema !== undefined ? sanitizeDataForNewSchema(ctx, newSchema, oldSchema, value) : value)
  });

  const optionSchema = $derived.by(() => {
    const selected = selectedOption.value;
    if (selected < 0) {
      return null;
    }
    const schema = retrievedOptions[selected];
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
      return optionsUiSchemas[selected];
    }
    return config.uiSchema;
  });

  const enumOptionLabel = $derived.by(() => {
    const customTitle = config.uiOptions?.title ?? config.schema.title;
    return customTitle !== undefined
      ? (index: number) => ctx.translation("multi-schema-option-label-with-title", customTitle, index)
      : (index: number) => ctx.translation("multi-schema-option-label", index);
  })
  const enumOptions = $derived<EnumOption<number>[]>(
    retrievedOptions.map((s, i) => ({
      label:
        optionsUiOptions[i]?.title ??
        s.title ??
        enumOptionLabel(i),
      value: i,
      disabled: false,
    }))
  );

  const widgetConfig: Config = $derived.by(() => {
    const suffix = `${combinationKey.toLowerCase()}`;
    return {
      ...config,
      schema: { type: "integer", default: 0 },
      name: `${config.name}__${suffix}`,
      idSchema: { $id: computeId(config.idSchema, suffix) },
      required: true,
    };
  });
  const attributes = $derived(selectAttributes(ctx, widgetConfig));
</script>

<Template {config} {value}>
  {#snippet optionSelector()}
    <Widget
      errors={[]}
      {attributes}
      config={widgetConfig}
      options={enumOptions}
      bind:value={selectedOption.value}
      multiple={false}
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
