<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";
  import { getDiscriminatorFieldFromSchema, mergeSchemas } from "../schema";
  import type { UiSchema } from "../ui-schema";
  import { getClosestMatchingOption, getUiOptions } from "../utils";
  import type { EnumOption } from "../enum";
  import { getWidget } from "../widgets";
  import type { Config } from "../config";
  import { computeId } from "../id-schema";

  import { getField, type FieldProps } from "./model";
  import { selectAttributes } from "./make-widget-attributes";

  let {
    value = $bindable(),
    config,
    combinationKey,
  }: FieldProps<"multi"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, "root", config));
  const Widget = $derived(getWidget(ctx, "select", config));

  const retrievedOptions = $derived(
    (config.schema[combinationKey] ?? []).map((s) =>
      typeof s !== "boolean" ? s : {}
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

  const enumOptions = $derived<EnumOption<number>[]>(
    retrievedOptions.map((s, i) => ({
      // TODO: Use translation
      label: optionsUiOptions[i]?.title ?? s.title ?? String(i),
      value: i,
      disabled: false,
    }))
  );

  const widgetConfig: Config = $derived.by(() => {
    const suffix = `__${combinationKey.toLowerCase()}`;
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

<Widget
  {attributes}
  config={widgetConfig}
  options={enumOptions}
  bind:value={selectedOption.value}
  multiple={false}
/>
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
