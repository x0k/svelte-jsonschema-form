import type { JSONSchema7TypeName } from "json-schema";
import { getContext, setContext, untrack } from "svelte";

import {
  ANY_OF_KEY,
  canUnionTypeShowData,
  castToUnionType,
  getDiscriminatorFieldFromSchema,
  getInitialUnionTypeIndex,
  getSimpleSchemaType,
  getUnionValueSchema,
  ONE_OF_KEY,
  typeOfValue,
  type Schema,
  type SchemaDefinition,
} from "#core/index.js";
import {
  getClosestMatchingOption,
  getDefaultFieldState,
  getPseudoId,
  getPseudoPath,
  getRenderedOptionSchema,
  retrieveEnumValueMapperBuilder,
  retrieveSchema,
  retrieveUiSchema,
  uiTitleOption,
  type Config,
  type FieldPseudoElement,
  type FormEnumOption,
  type FormState,
  type FormValue,
  type Translate,
  type UiSchemaDefinition,
} from "#form/index.js";
import type { Ref } from "#lib/svelte.svelte.js";
import {
  createMappedOption,
  singleOption,
  type EnumValueMapper,
} from "#options.svelte.js";

import { formDataForNewOption } from "./form-data-for-new-option.js";

export type CombinationKey = typeof ONE_OF_KEY | typeof ANY_OF_KEY;

export interface CombinationContext {
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
  schemas: () => SchemaDefinition[];
  uiSchemas: () => UiSchemaDefinition[];
  pseudoSuffix: () => FieldPseudoElement;
  translate: () => Translate;
}

// Strips the combination key (oneOf/anyOf) from the schema, leaving only
// the "rest" properties. Returns undefined for non-object schemas since they
// cannot have sibling properties alongside oneOf/anyOf.
//
// The rest field is a normal object field: it keeps the parent's title,
// description and UI schema, so the parent's `ui:options`/`ui:components`
// apply to the shared properties. It renders the combination field's meta,
// which is why the multi-field template receives `showMeta={false}` whenever
// this config exists.
export function deriveXxxOfRestConfig(
  cfg: Config,
  key: CombinationKey
): Config | undefined {
  const { [key]: _, ...restSchema } = cfg.schema;
  const currentType = getSimpleSchemaType(cfg.schema);
  if (currentType !== "object") {
    return undefined;
  }
  const restType = getSimpleSchemaType(restSchema);
  return {
    ...cfg,
    schema: restType === "unknown" ? { type: "object" } : restSchema,
  } satisfies Config;
}

export function createXxxOfCombinationContext<T>({
  ctx,
  config,
  value,
  setValue,
  schemas,
  uiSchemas,
  pseudoSuffix,
  translate,
}: CombinationContextOptions<T>): CombinationContext {
  const t = $derived(translate());

  const retrievedOptions: Schema[] = $derived(
    schemas().map((s) =>
      typeof s !== "boolean" ? retrieveSchema(ctx, s, value()) : {}
    )
  );

  const renderedOptions: Schema[] = $derived.by(() => {
    const schema = config().schema;
    return retrievedOptions.map((option) =>
      getRenderedOptionSchema(ctx, schema, option)
    );
  });

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
  // normalized one, this effect derives a new form value for the target option
  // with formDataForNewOption (sanitizing the current data toward the new
  // schema and letting its declared defaults replace values the previous
  // option left behind), then commits it via setNormalizedValue. The order
  // matters: normalizedSelectedOption is set before setNormalizedValue, so the
  // write-counting correctly attributes the subsequent value change to this
  // internal normalization, not to an external edit.
  $effect(() => {
    const pendingSelected = pendingSelectedOption;
    const normalizedSelected = normalizedSelectedOption;
    if (normalizedSelected === pendingSelected) {
      return;
    }
    const nextValue = untrack(() => {
      const nextSchema = renderedOptions[pendingSelected];
      if (nextSchema === undefined) {
        return undefined;
      }
      const oldSchema =
        normalizedSelected !== undefined
          ? renderedOptions[normalizedSelected]
          : undefined;
      if (oldSchema === undefined) {
        return getDefaultFieldState(ctx, {
          schema: nextSchema,
          formData: value(),
          includeUndefinedValues: "excludeObjectChildren",
        });
      }
      return formDataForNewOption(ctx, value(), nextSchema, oldSchema);
    });
    normalizedSelectedOption = pendingSelected;
    setNormalizedValue(nextValue);
  });

  const optionsUiSchemas = $derived(
    uiSchemas().map((s) => retrieveUiSchema(ctx, s))
  );
  const enumOptionLabel = $derived.by(() => {
    const cfg = config();
    const explicitTitle = uiTitleOption(ctx, cfg.uiSchema) ?? cfg.schema.title;
    return explicitTitle
      ? (index: number) =>
          t("multi-schema-option-label-with-title", {
            index,
            title: explicitTitle,
          })
      : (index: number) => t("multi-schema-option-label", { index });
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
    const uiSchema = retrieveUiSchema(
      ctx,
      cfg.uiSchema.combinationFieldOptionSelector
    );
    return {
      path: getPseudoPath(ctx, cfg.path, pseudoSuffix()),
      title: uiTitleOption(ctx, uiSchema) ?? cfg.title,
      schema: { type: "integer", default: 0 },
      uiSchema,
      required: true,
      value: () => selectedOption,
    };
  });

  const { options: enumOptions, mapper } = $derived.by(() => {
    const builder = retrieveEnumValueMapperBuilder(ctx, optionSelectorConfig);
    const options = optionTitles.map((label, i) => {
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config().path, i),
        label,
        value: i,
        disabled: false,
      });
    });
    return { options, mapper: builder.build() };
  });

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => selectedOption,
    update: (v) => selectOption(v as number),
  });

  const fieldConfig: Config | null = $derived.by(() => {
    const selected = selectedOption;
    if (selected < 0) {
      return null;
    }
    const cfg = config();
    const optionSchema = renderedOptions[selected]!;
    // The parent UI schema configures the combination field itself: its
    // selector, meta and components. A branch is only configured by its own UI
    // schema entry, so a branch without one uses the defaults.
    return {
      path: cfg.path,
      title: "",
      schema: optionSchema,
      uiSchema: optionsUiSchemas[selected] ?? {},
      required: cfg.required,
      value,
    };
  });

  return {
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

function getSchemaTypes(schema: SchemaDefinition): JSONSchema7TypeName[] {
  if (typeof schema === "boolean" || schema.type === undefined) {
    return [];
  }
  return Array.isArray(schema.type) ? schema.type : [schema.type];
}

export function createUnionCombinationContext<T>({
  ctx,
  config,
  pseudoSuffix,
  schemas,
  setValue,
  uiSchemas,
  value,
}: CombinationContextOptions<T>): CombinationContext {
  // The types the selector offers, in the order the schema lists them. A union
  // that also carries `oneOf`/`anyOf` keeps those options on its value schema,
  // so only the `type` keyword feeds the selector.
  const types: JSONSchema7TypeName[] = $derived.by(() => {
    const result: JSONSchema7TypeName[] = [];
    for (const schema of schemas()) {
      for (const type of getSchemaTypes(schema)) {
        if (!result.includes(type)) {
          result.push(type);
        }
      }
    }
    return result;
  });

  // The type the user picked, kept as a name rather than an index so a schema
  // that replaces its type list wholesale cannot silently point the selector at
  // a different type.
  let pickedType = $state.raw<JSONSchema7TypeName>();

  // The selection, reconciled against the current value. A selection the schema
  // no longer allows gives way to the type the current data fits, and a
  // selection the data no longer fits gives way too, since data replaced from
  // outside the form arrives without going through the selector. An empty value
  // says nothing about the type it was cleared from, so it keeps the selection.
  const selectedType = $derived.by((): JSONSchema7TypeName | undefined => {
    const current = pickedType;
    const val = value();
    if (
      current !== undefined &&
      types.includes(current) &&
      (val === undefined || canUnionTypeShowData(current, typeOfValue(val)))
    ) {
      return current;
    }
    return types[getInitialUnionTypeIndex(types, val)];
  });

  // Stores the reconciled type so a selection the user can no longer see does
  // not come back when the value changes again.
  $effect(() => {
    const type = selectedType;
    if (type !== undefined && type !== pickedType) {
      pickedType = type;
    }
  });

  const selectedOption = $derived(
    selectedType === undefined ? -1 : types.indexOf(selectedType)
  );

  function selectOption(nextSelected: number | undefined) {
    const type =
      typeof nextSelected === "number" ? types[nextSelected] : undefined;
    if (type === undefined) {
      return;
    }
    pickedType = type;
    const currentValue = untrack(value);
    const nextValue = castToUnionType(currentValue, type);
    if (!Object.is(currentValue, nextValue)) {
      setValue(nextValue);
    }
  }

  const optionsUiSchemas = $derived(
    uiSchemas().map((s) => retrieveUiSchema(ctx, s))
  );

  const optionTitles = $derived(
    types.map((type, index) => {
      const uiSchema = optionsUiSchemas[index];
      return (uiSchema && uiTitleOption(ctx, uiSchema)) ?? type;
    })
  );

  // As with oneOf/anyOf, the parent UI schema configures the union field, not
  // the field for the selected type. Only the type's own `union` entry does.
  const selectedUiSchema = $derived(optionsUiSchemas[selectedOption] ?? {});

  const optionSelectorConfig: Config = $derived.by(() => {
    const cfg = config();
    const uiSchema = retrieveUiSchema(
      ctx,
      cfg.uiSchema.combinationFieldOptionSelector
    );
    return {
      path: getPseudoPath(ctx, cfg.path, pseudoSuffix()),
      title: uiTitleOption(ctx, uiSchema) ?? cfg.title,
      schema: { type: "integer", default: 0 },
      uiSchema,
      required: true,
      value: () => selectedOption,
    };
  });

  const { options: enumOptions, mapper } = $derived.by(() => {
    const builder = retrieveEnumValueMapperBuilder(ctx, optionSelectorConfig);
    const options = optionTitles.map((label, i) => {
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config().path, i),
        label,
        value: i,
        disabled: false,
      });
    });
    return { options, mapper: builder.build() };
  });

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => selectedOption,
    update: (v) => selectOption(v as number),
  });

  // The field renders the schema with its type pinned to the one selected, so
  // every other keyword keeps describing the value being entered. The title
  // belongs to the template around it, so it is blank here.
  const fieldConfig: Config | null = $derived.by(() => {
    const type = selectedType;
    if (type === undefined) {
      return null;
    }
    const cfg = config();
    return {
      path: cfg.path,
      title: "",
      schema: getUnionValueSchema(cfg.schema, type),
      uiSchema: selectedUiSchema,
      required: cfg.required,
      value,
    };
  });

  return {
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
