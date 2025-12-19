import { getContext, setContext } from "svelte";

import {
  getDefaultValueForType,
  getSimpleSchemaType,
  isAdditionalProperty,
  isOrderedSchemaDeepEqual,
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
  validateAdditionalPropertyKey,
  retrieveSchema,
  getFieldErrors,
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
  getChildPath,
  type FieldErrors,
} from "@/form/index.js";

import {
  createAdditionalPropertyKey,
  generateNewKey,
  createOriginalKeysOrder,
} from "./model.js";

export interface ObjectContext {
  errors: () => FieldErrors;
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
}

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext(): ObjectContext {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext(ctx: ObjectContext) {
  setContext(OBJECT_CONTEXT, ctx);
}

export interface ObjectContextOptions<T> {
  ctx: FormState<T>;
  config: () => Config;
  value: () => SchemaObjectValue | null | undefined;
  setValue: (value: SchemaObjectValue) => void;
  translate: Translate;
}

export function createObjectContext<T>({
  ctx,
  config,
  value,
  setValue,
  translate,
}: ObjectContextOptions<T>): ObjectContext {
  // NOTE: This is required for computing a schema which will include all
  // additional properties in the `properties` field with the
  // `ADDITIONAL_PROPERTY_FLAG` flag and `dependencies` resolution.
  const retrievedSchema = $derived(
    retrieveSchema(ctx, config().schema, value())
  );

  let lastSchemaProperties: Schema["properties"] = undefined;
  const schemaProperties = $derived.by(() => {
    const snap = $state.snapshot(retrievedSchema.properties);
    // NOTE: Cache hits are verified on `any-of` and `property-dependencies` examples.
    if (!isOrderedSchemaDeepEqual(lastSchemaProperties, snap)) {
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

      let patterns: string[];
      if (
        patternProperties !== undefined &&
        ((patterns = Object.keys(patternProperties)), patterns.length > 0)
      ) {
        const pairs = patterns.map((pattern) => {
          const property = patternProperties[pattern]!;
          return [
            new RegExp(pattern),
            typeof property === "boolean" ? {} : property,
          ] as const;
        });
        const getDefaultSchema = isSchemaObjectValue(additionalProperties)
          ? (val: SchemaObjectValue | null | undefined) =>
              retrieveSchema(ctx, additionalProperties, val)
          : () => pairs[0]![1];
        return (val, key) =>
          retrieveSchema(
            ctx,
            pairs.find(([p]) => p.test(key))?.[1] ?? getDefaultSchema(val),
            val
          );
      }
      if (isSchemaObjectValue(additionalProperties)) {
        return (val) => retrieveSchema(ctx, additionalProperties, val);
      }
      return () => ({});
    }
  );

  const canExpand = $derived(
    uiOption("expandable") !== false &&
      isSchemaExpandable(retrievedSchema, value())
  );

  const errors = $derived(getFieldErrors(ctx, config().path));

  const newKeyPrefix = $derived(translate("additional-property", {}));

  function onChange(val: SchemaObjectValue | null | undefined) {
    setFieldState(ctx, config().path, FIELD_CHANGED);
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
        path: getChildPath(ctx, config.path, property),
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
        getDefaultFieldState(ctx, {
          schema: additionalPropertySchema,
          formData: undefined,
        }) ??
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
