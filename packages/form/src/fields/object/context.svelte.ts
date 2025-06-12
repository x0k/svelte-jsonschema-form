import { getContext, setContext, untrack } from "svelte";

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
  type FormInternalContext,
  type Validator,
  validateAdditionalPropertyKey,
  retrieveSchema,
  getErrors,
  type FieldError,
  type PossibleError,
  createChildId,
  retrieveUiSchema,
  type UiSchemaDefinition,
  type UiOption,
  retrieveUiOption,
  uiTitleOption,
  type Translate,
} from "@/form/index.js";

import {
  createAdditionalPropertyKey,
  generateNewKey,
  createOriginalKeysOrder,
} from "./model.js";

export type ObjectContext<V extends Validator> = {
  readonly errors: FieldError<PossibleError<V>>[];
  readonly canExpand: boolean;
  readonly propertiesOrder: string[];
  addProperty(): void;
  renameProperty(oldProp: string, newProp: string, config: Config): void;
  removeProperty(prop: string): void;
  isAdditionalProperty(property: string): boolean;
  propertyConfig(
    config: Config,
    property: string,
    isAdditional: boolean
  ): Config;
};

const OBJECT_CONTEXT = Symbol("object-context");

export function getObjectContext<V extends Validator>(): ObjectContext<V> {
  return getContext(OBJECT_CONTEXT);
}

export function setObjectContext<V extends Validator>(ctx: ObjectContext<V>) {
  setContext(OBJECT_CONTEXT, ctx);
}

export function createObjectContext<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: () => Config,
  value: () => SchemaObjectValue | undefined,
  setValue: (v: SchemaObjectValue) => void,
  translate: Translate
): ObjectContext<V> {
  // NOTE: This is required for computing a schema which will include all
  // additional properties in the `properties` field with the
  // `ADDITIONAL_PROPERTY_FLAG` flag and `dependencies` resolution.
  const retrievedSchema = $derived(
    retrieveSchema(ctx, config().schema, value())
  );

  let lastSchemaProperties: Schema["properties"] = undefined;
  const schemaProperties = $derived.by(() => {
    if (!isSchemaDeepEqual(lastSchemaProperties, retrievedSchema.properties)) {
      lastSchemaProperties = $state.snapshot(retrievedSchema.properties);
    }
    return lastSchemaProperties;
  });

  // NOTE: This code should populate `defaults` for properties from
  // `dependencies` before new `fields` will populate their `defaults`.
  $effect(() => {
    schemaProperties;
    setValue(
      untrack(
        () =>
          getDefaultFieldState(
            ctx,
            retrievedSchema,
            value()
          ) as SchemaObjectValue
      )
    );
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
    (): ((val: SchemaObjectValue | undefined, key: string) => Schema) => {
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

  function validate(val: SchemaObjectValue) {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_OBJECT_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), val);
  }

  const additionalPropertyKey = $derived(
    uiOption("additionalPropertyKey") ?? createAdditionalPropertyKey
  );

  return {
    get errors() {
      return errors;
    },
    get canExpand() {
      return canExpand;
    },
    get propertiesOrder() {
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
        id: createChildId(config.id, property, ctx),
        name: property,
        title: uiTitleOption(ctx, uiSchema) ?? schema.title ?? property,
        schema,
        uiSchema,
        required: requiredProperties.has(property),
      };
    },
    addProperty() {
      const val = value();
      if (val === undefined) {
        return;
      }
      const newKey = generateNewKey(val, newKeyPrefix, additionalPropertyKey);
      const additionalPropertySchema = getAdditionalPropertySchema(val, newKey);
      val[newKey] =
        getDefaultFieldState(ctx, additionalPropertySchema, undefined) ??
        getDefaultValueForType(getSimpleSchemaType(additionalPropertySchema));
      validate(val);
    },
    removeProperty(prop) {
      const val = value();
      if (val === undefined) {
        return;
      }
      delete val[prop];
      validate(val);
    },
    renameProperty(oldProp, newProp, fieldConfig) {
      const val = value();
      if (val === undefined) {
        return;
      }
      const newKey = generateNewKey(val, newProp, additionalPropertyKey);
      if (!validateAdditionalPropertyKey(ctx, config(), newKey, fieldConfig)) {
        return;
      }
      val[newKey] = val[oldProp];
      delete val[oldProp];
      validate(val);
    },
  };
}
