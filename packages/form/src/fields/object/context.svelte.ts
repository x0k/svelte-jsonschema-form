import { getContext, setContext } from "svelte";

import {
  getDefaultValueForType,
  getSimpleSchemaType,
  isAdditionalProperty,
  isSchemaDeepEqual,
  isSchemaExpandable,
  isSchemaObjectValue,
  orderProperties,
  type SchemaObjectValue,
} from "@/core/index.js";
import {
  AFTER_SUBMITTED,
  getDefaultFieldState,
  ON_OBJECT_CHANGE,
  validateField,
  type Config,
  type Schema,
  type Validator,
  validateAdditionalPropertyKey,
  retrieveSchema,
  getErrors,
  type FieldError,
  type PossibleError,
  createPropertyId,
  retrieveUiSchema,
  type UiSchemaDefinition,
  type UiOption,
  retrieveUiOption,
  uiTitleOption,
  type Translate,
  markSchemaChange,
  type FormState,
  getFieldsValidationMode,
  setFieldState,
  FIELD_CHANGED,
} from "@/form/index.js";

import {
  createAdditionalPropertyKey,
  generateNewKey,
  createOriginalKeysOrder,
} from "./model.js";

export type ObjectContext<V extends Validator> = {
  errors: () => FieldError<PossibleError<V>>[];
  canExpand: () => boolean;
  propertiesOrder: () => string[];
  addProperty: () => void;
  renameProperty: (oldProp: string, newProp: string, config: Config) => void;
  removeProperty: (prop: string) => void;
  isAdditionalProperty: (property: string) => boolean;
  propertyConfig: (
    config: Config,
    property: string,
    isAdditional: boolean
  ) => Config;
};

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext<V extends Validator>(): ObjectContext<V> {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext<V extends Validator>(ctx: ObjectContext<V>) {
  setContext(OBJECT_CONTEXT, ctx);
}

export interface ObjectContextOptions<T, V extends Validator> {
  ctx: FormState<T, V>;
  config: () => Config;
  value: () => SchemaObjectValue | null | undefined;
  setValue: (value: SchemaObjectValue) => void;
  translate: Translate;
}

export function createObjectContext<T, V extends Validator>({
  ctx,
  config,
  value,
  setValue,
  translate,
}: ObjectContextOptions<T, V>): ObjectContext<V> {
  // NOTE: This is required for computing a schema which will include all
  // additional properties in the `properties` field with the
  // `ADDITIONAL_PROPERTY_FLAG` flag and `dependencies` resolution.
  const retrievedSchema = $derived(
    retrieveSchema(ctx, config().schema, value())
  );

  let lastSchemaProperties: Schema["properties"] = undefined;
  const schemaProperties = $derived.by(() => {
    // TODO: Remove unnecessary allocations after this issue will be resolved
    // https://github.com/sveltejs/svelte/issues/16658
    const snap = $state.snapshot(retrievedSchema.properties);
    if (!isSchemaDeepEqual(lastSchemaProperties, snap)) {
      lastSchemaProperties = snap;
    }
    return lastSchemaProperties;
  });

  // NOTE: `defaults` population
  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    schemaProperties;
    markSchemaChange(ctx);
  });

  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config(), opt);

  const schemaPropertiesOrder = $derived(
    isSchemaObjectValue(schemaProperties)
      ? orderProperties(
          schemaProperties,
          uiOption("order") ?? createOriginalKeysOrder(schemaProperties)
        )
      : []
  );

  const requiredProperties = $derived(new Set(retrievedSchema.required));

  const getAdditionalPropertySchema = $derived.by(
    (): ((
      val: SchemaObjectValue | null | undefined,
      key: string
    ) => Schema) => {
      const { additionalProperties, patternProperties } = retrievedSchema;

      if (isSchemaObjectValue(additionalProperties)) {
        return (val) => retrieveSchema(ctx, additionalProperties, val);
      }
      let patterns: string[];
      if (
        patternProperties === undefined ||
        ((patterns = Object.keys(patternProperties)), patterns.length === 0)
      ) {
        return () => ({});
      }
      const pairs = patterns.map((pattern) => {
        const property = patternProperties[pattern]!;
        return [
          new RegExp(pattern),
          typeof property === "boolean" ? {} : property,
        ] as const;
      });
      return (val, key) =>
        retrieveSchema(
          ctx,
          pairs.find(([p]) => p.test(key))?.[1] ?? pairs[0]![1],
          val
        );
    }
  );

  const canExpand = $derived(
    uiOption("expandable") !== false &&
      isSchemaExpandable(retrievedSchema, value())
  );

  const errors = $derived(getErrors(ctx, config().id));

  const newKeyPrefix = $derived(translate("additional-property", {}));

  function onChange(val: SchemaObjectValue | null | undefined) {
    setFieldState(ctx, config().id, FIELD_CHANGED);
    const m = getFieldsValidationMode(ctx);
    if (!(m & ON_OBJECT_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), val);
  }

  const additionalPropertyKey = $derived(
    uiOption("additionalPropertyKey") ?? createAdditionalPropertyKey
  );

  return {
    errors() {
      return errors;
    },
    canExpand() {
      return canExpand;
    },
    propertiesOrder() {
      return schemaPropertiesOrder;
    },
    isAdditionalProperty(property) {
      return isAdditionalProperty(schemaProperties!, property);
    },
    propertyConfig(config, property, isAdditional) {
      const definition = schemaProperties![property] ?? false;
      const schema = typeof definition === "boolean" ? {} : definition;
      const uiSchema = retrieveUiSchema(
        ctx,
        isAdditional
          ? config.uiSchema.additionalProperties
          : (config.uiSchema[property] as UiSchemaDefinition | undefined)
      );
      return {
        id: createPropertyId(ctx, config.id, property),
        title: uiTitleOption(ctx, uiSchema) ?? schema.title ?? property,
        schema,
        uiSchema,
        required: requiredProperties.has(property),
      };
    },
    addProperty() {
      let val = value();
      const newKey = val
        ? generateNewKey(val, newKeyPrefix, additionalPropertyKey)
        : additionalPropertyKey(newKeyPrefix, 0);
      const additionalPropertySchema = getAdditionalPropertySchema(val, newKey);
      const propValue =
        getDefaultFieldState(ctx, additionalPropertySchema, undefined) ??
        getDefaultValueForType(getSimpleSchemaType(additionalPropertySchema));
      if (val) {
        val[newKey] = propValue;
      } else {
        val = { [newKey]: propValue };
        setValue(val);
      }
      onChange(val);
    },
    removeProperty(prop) {
      const val = value();
      if (!val) {
        return;
      }
      delete val[prop];
      onChange(val);
    },
    renameProperty(oldProp, newProp, fieldConfig) {
      const val = value();
      if (!val) {
        return;
      }
      const newKey = generateNewKey(val, newProp, additionalPropertyKey);
      if (!validateAdditionalPropertyKey(ctx, config(), newKey, fieldConfig)) {
        return;
      }
      val[newKey] = val[oldProp];
      delete val[oldProp];
      onChange(val);
    },
  };
}
