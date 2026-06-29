import { getContext, setContext, untrack } from "svelte";

import {
  ANY_OF_KEY,
  getDiscriminatorFieldFromSchema,
  getSimpleSchemaType,
  ONE_OF_KEY,
  type Schema,
} from "@/core/index.js";
import {
  getClosestMatchingOption,
  getDefaultFieldState,
  getPseudoId,
  getPseudoPath,
  retrieveSchema,
  retrieveUiSchema,
  retrieveUiOption,
  sanitizeDataForNewSchema,
  uiTitleOption,
  type Config,
  type FormEnumOption,
  type FormState,
  type FormValue,
  type Translate,
} from "@/form/index.js";
import type { Ref } from "@/lib/svelte.svelte.js";
import {
  IdEnumValueMapperBuilder,
  singleOption,
  type EnumValueMapper,
} from "@/options.svelte.js";

export type CombinationKey = typeof ONE_OF_KEY | typeof ANY_OF_KEY;

export interface CombinationContext {
  restConfig: () => Config | null;
  selectedOption: () => number;
  selectOption: (selected: number | undefined) => void;
  optionSelectorProps: () => {
    config: Config;
    options: FormEnumOption[];
    mapper: EnumValueMapper;
    mapped: Ref<string>;
    clearable: boolean;
  };
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
  // Strips the combination key (oneOf/anyOf) from the schema, leaving only
  // the "rest" properties. Returns null for non-object schemas since they
  // cannot have sibling properties alongside oneOf/anyOf.
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

  // Write-counting mechanism to distinguish internal normalization writes
  // from external value changes. When this module normalizes a value (e.g.
  // switching options and sanitizing data), it increments the counter before
  // calling setValue. The pendingSelectedOption derivation then consumes that
  // write and preserves the current selection instead of recomputing it via
  // getClosestMatchingOption.
  let internalValueWriteVersion = 0;
  let consumedInternalValueWriteVersion = 0;

  // Wraps setValue with write-counting. Increments the counter for both true
  // value changes and object writes with the same reference. Same-reference
  // objects are counted because normalization may return the same object after
  // in-place sanitization — it still represents an intentional internal write
  // that should prevent pendingSelectedOption from recomputing.
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

  // Returns true once per internal write. The pendingSelectedOption derivation
  // calls this to detect whether its current computation was triggered by an
  // internal normalization write (in which case it returns the existing
  // normalized selection) or by an external change (in which case it runs
  // getClosestMatchingOption to find the best matching option).
  function consumePendingInternalValueWrite() {
    if (consumedInternalValueWriteVersion === internalValueWriteVersion) {
      return false;
    }
    consumedInternalValueWriteVersion = internalValueWriteVersion;
    return true;
  }

  // The "normalized" selection is the authoritative option index. It is set
  // after the $effect below applies the value change, so it stays in sync
  // with the actual form value.
  let normalizedSelectedOption = $state.raw<number>();

  // The "pending" selection is a derived value that reacts to changes. On
  // external value edits it runs getClosestMatchingOption to find which
  // option best matches the new data. On internal writes (from this module)
  // it short-circuits and returns the existing normalized selection to avoid
  // unnecessary recomputation.
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

  // The public selection falls back to pending when no explicit selection
  // has been normalized yet (first render).
  const selectedOption = $derived(
    normalizedSelectedOption ?? pendingSelectedOption
  );

  function selectOption(nextSelected: number | undefined) {
    if (typeof nextSelected === "number") {
      pendingSelectedOption = nextSelected;
    }
  }

  // Syncs pending → normalized. When the pending selection differs from the
  // normalized one, this effect computes a new form value for the target
  // option (sanitizing existing data to fit the new schema), then commits it
  // via setNormalizedValue. The order matters: normalizedSelectedOption is
  // set before setNormalizedValue so the write-counting in setNormalizedValue
  // correctly attributes the subsequent value change to this internal
  // normalization, not to an external edit.
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
      value: () => selectedOption,
    };
  });

  const { options: enumOptions, mapper } = $derived.by(() => {
    const builder =
      retrieveUiOption(
        ctx,
        optionSelectorConfig,
        "enumValueMapperBuilder"
      )?.() ?? new IdEnumValueMapperBuilder();
    const options = optionTitles.map((label, i) => {
      const option: FormEnumOption = {
        id: getPseudoId(ctx, config().path, i),
        label,
        value: i,
        disabled: false,
      };
      option.mappedValue = builder.push(option);
      return option;
    });
    return { options, mapper: builder.build() };
  });

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => selectedOption,
    update: (v) => selectOption(v as number),
  });

  // Builds the field config for the currently selected option. Merges the
  // parent schema's required array into the option schema so that sibling
  // required properties from the combination schema are enforced.
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
      value,
    };
  });

  return {
    restConfig() {
      return restConfig;
    },
    selectedOption() {
      return selectedOption;
    },
    selectOption,
    optionSelectorProps() {
      return {
        clearable: false,
        config: optionSelectorConfig,
        options: enumOptions,
        mapper,
        mapped,
      };
    },
    fieldConfig() {
      return fieldConfig;
    },
  };
}
