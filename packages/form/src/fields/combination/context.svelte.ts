import { getContext, setContext, untrack } from "svelte";

import {
  ANY_OF_KEY,
  getDiscriminatorFieldFromSchema,
  getSimpleSchemaType,
  ONE_OF_KEY,
  type EnumOption,
  type Schema,
} from "@/core/index.js";
import {
  getClosestMatchingOption,
  getDefaultFieldState,
  getPseudoId,
  getPseudoPath,
  retrieveSchema,
  retrieveUiSchema,
  sanitizeDataForNewSchema,
  uiTitleOption,
  type Config,
  type FormState,
  type FormValue,
  type Translate,
  type UiSchema,
} from "@/form/index.js";

export type CombinationKey = typeof ONE_OF_KEY | typeof ANY_OF_KEY;

export interface CombinationContext {
  restConfig: () => Config | null;
  options: () => Schema[];
  optionsUiSchemas: () => UiSchema[];
  selectedOption: () => number;
  selectOption: (selected: number | undefined) => void;
  optionSelectorConfig: () => Config;
  optionSelectorOptions: () => EnumOption<number>[];
  fieldConfig: () => Config | null;
}

const COMBINATION_CONTEXT = Symbol("combination-context");

export function getCombinationContext(): CombinationContext {
  return getContext(COMBINATION_CONTEXT);
}

export function setCombinationContext(ctx: CombinationContext) {
  setContext(COMBINATION_CONTEXT, ctx);
}

export interface CombinationContextOptions<T> {
  ctx: FormState<T>;
  config: () => Config;
  value: () => FormValue;
  setValue: (value: FormValue) => void;
  combinationKey: CombinationKey;
  translate: Translate;
}

export function createCombinationContext<T>({
  ctx,
  config,
  value,
  setValue,
  combinationKey,
  translate,
}: CombinationContextOptions<T>): CombinationContext {
  const restConfig = $derived.by(() => {
    const cfg = config();
    const { [combinationKey]: _, ...restSchema } = cfg.schema;
    const currentType = getSimpleSchemaType(cfg.schema);
    if (currentType !== "object") {
      return null;
    }
    const restType = getSimpleSchemaType(restSchema);
    return {
      ...cfg,
      schema: restType === "unknown" ? { type: "object" } : restSchema,
    } satisfies Config;
  });

  const retrievedOptions: Schema[] = $derived(
    (config().schema[combinationKey] ?? []).map((s) =>
      typeof s !== "boolean" ? retrieveSchema(ctx, s, value()) : {}
    )
  );

  let internalValueWriteVersion = 0;
  let consumedInternalValueWriteVersion = 0;

  function setNormalizedValue(nextValue: FormValue) {
    const currentValue = untrack(value);
    if (
      !Object.is(currentValue, nextValue) ||
      (nextValue !== null && typeof nextValue === "object")
    ) {
      internalValueWriteVersion += 1;
    }
    setValue(nextValue);
  }

  function consumePendingInternalValueWrite() {
    if (consumedInternalValueWriteVersion === internalValueWriteVersion) {
      return false;
    }
    consumedInternalValueWriteVersion = internalValueWriteVersion;
    return true;
  }

  let normalizedSelectedOption = $state.raw<number>();
  let pendingSelectedOption = $derived.by(() => {
    const options = retrievedOptions;
    const selectedFallback = untrack(() => normalizedSelectedOption ?? 0);
    if (consumePendingInternalValueWrite()) {
      return selectedFallback;
    }
    return getClosestMatchingOption(
      ctx,
      value(),
      options,
      selectedFallback,
      getDiscriminatorFieldFromSchema(config().schema)
    );
  });
  const selectedOption = $derived(
    normalizedSelectedOption ?? pendingSelectedOption
  );

  function selectOption(nextSelected: number | undefined) {
    if (typeof nextSelected === "number") {
      pendingSelectedOption = nextSelected;
    }
  }

  $effect(() => {
    const pendingSelected = pendingSelectedOption;
    const normalizedSelected = normalizedSelectedOption;
    if (normalizedSelected === pendingSelected) {
      return;
    }
    const nextValue = untrack(() => {
      const nextSchema = retrievedOptions[pendingSelected];
      if (nextSchema === undefined) {
        return undefined;
      }
      const oldSchema =
        normalizedSelected !== undefined
          ? retrievedOptions[normalizedSelected]
          : undefined;
      return getDefaultFieldState(ctx, {
        schema: nextSchema,
        formData:
          oldSchema !== undefined
            ? sanitizeDataForNewSchema(ctx, nextSchema, oldSchema, value())
            : value(),
        includeUndefinedValues: "excludeObjectChildren",
      });
    });
    normalizedSelectedOption = pendingSelected;
    setNormalizedValue(nextValue);
  });

  const optionsUiSchemas = $derived.by(() => {
    const schemas = config().uiSchema[combinationKey];
    return Array.isArray(schemas)
      ? schemas.map((s) => retrieveUiSchema(ctx, s))
      : [];
  });
  const enumOptionLabel = $derived.by(() => {
    const cfg = config();
    const explicitTitle = uiTitleOption(ctx, cfg.uiSchema) ?? cfg.schema.title;
    return explicitTitle
      ? (index: number) =>
          translate("multi-schema-option-label-with-title", {
            index,
            title: explicitTitle,
          })
      : (index: number) => translate("multi-schema-option-label", { index });
  });
  const optionTitles = $derived.by(() => {
    const cfg = config();
    const discriminator = getDiscriminatorFieldFromSchema(cfg.schema);
    return retrievedOptions.map((schema, index) => {
      if (discriminator !== undefined) {
        const uiSchemaDefinition = optionsUiSchemas[index]?.[discriminator];
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
        const schemaDefinition = schema.properties?.[discriminator];
        if (
          schemaDefinition !== undefined &&
          typeof schemaDefinition !== "boolean"
        ) {
          const { title } = retrieveSchema(ctx, schemaDefinition, undefined);
          if (title !== undefined) {
            return title;
          }
        }
      }
      const uiSchema = optionsUiSchemas[index];
      return (
        (uiSchema && uiTitleOption(ctx, uiSchema)) ??
        schema.title ??
        enumOptionLabel(index)
      );
    });
  });

  const enumOptions = $derived<EnumOption<number>[]>(
    optionTitles.map((label, i) => ({
      id: getPseudoId(ctx, config().path, i),
      label,
      value: i,
      disabled: false,
    }))
  );

  const optionSelectorConfig: Config = $derived.by(() => {
    const cfg = config();
    const suffix = combinationKey.toLowerCase() as Lowercase<CombinationKey>;
    const uiSchema = retrieveUiSchema(
      ctx,
      cfg.uiSchema.combinationFieldOptionSelector
    );
    return {
      path: getPseudoPath(ctx, cfg.path, suffix),
      title: uiTitleOption(ctx, uiSchema) ?? cfg.title,
      schema: { type: "integer", default: 0 },
      uiSchema,
      required: true,
    };
  });

  const fieldConfig: Config | null = $derived.by(() => {
    const selected = selectedOption;
    if (selected < 0) {
      return null;
    }
    const cfg = config();
    const schema = retrievedOptions[selected]!;
    const { required } = cfg.schema;
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
        : cfg.uiSchema;
    return {
      path: cfg.path,
      title: "",
      schema: optionSchema,
      uiSchema: optionUiSchema,
      required: cfg.required,
    };
  });

  return {
    restConfig() {
      return restConfig;
    },
    options() {
      return retrievedOptions;
    },
    optionsUiSchemas() {
      return optionsUiSchemas;
    },
    selectedOption() {
      return selectedOption;
    },
    selectOption,
    optionSelectorConfig() {
      return optionSelectorConfig;
    },
    optionSelectorOptions() {
      return enumOptions;
    },
    fieldConfig() {
      return fieldConfig;
    },
  };
}
