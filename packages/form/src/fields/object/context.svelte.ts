import { getContext, setContext } from "svelte";

import {
  additionalPropertiesKeyword,
  getAdditionalPropertySchema as getSchemaForAdditionalProperty,
  getDefaultValueForType,
  getSimpleSchemaType,
  isAdditionalProperty,
  isObjectSchemaExpandable,
  isOrderedSchemaDeepEqual,
  isSchemaNullable,
  isSelectSchema,
  orderProperties,
  retrieveSchema,
  type SchemaObjectValue,
  type SchemaValue,
} from "#core/index.js";
import {
  AFTER_VALIDATED,
  getDefaultFieldState,
  ON_OBJECT_CHANGE,
  validateField,
  type Config,
  type Schema,
  validateAdditionalPropertyKey,
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
  getStableConfig,
  setValueAtPath,
  updateValueAtPath,
  type UiSchema,
} from "#form/index.js";
import { snapshotWithSymbols } from "#lib/svelte.svelte.js";

import { createFormOptions } from "../enum.js";
import {
  createAdditionalPropertyKey,
  generateNewKey,
  collectHeldKeys,
  stableKeyOf,
  withRenamedKey,
  withoutRenamedKey,
} from "./model.js";

export interface ObjectContext {
  errors: () => FieldErrors;
  canExpand: () => boolean;
  propertiesOrder: () => string[];
  addProperty: () => void;
  renameProperty: (
    oldProp: string,
    newProp: string | undefined,
    config: Config
  ) => void;
  removeProperty: (prop: string) => void;
  isAdditionalProperty: (property: string) => boolean;
  propertyConfig: (
    config: Config,
    property: string,
    isAdditional: boolean
  ) => Config;
  key: (property: string) => string;
  set: (property: string, value: SchemaValue | undefined) => void;
  keyInputSchemas: () => { schema: Schema; uiSchema: UiSchema };
  isAvailablePropertyKey: (key: string) => boolean;
}

const OBJECT_CONTEXT = Symbol("object-context");

// Shared so `schemaProperties` keeps a stable identity when the schema has
// no properties
const EMPTY_SCHEMA_PROPERTIES: Exclude<Schema["properties"], undefined> = {};

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
  setValue: (value: SchemaObjectValue | null | undefined) => void;
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
    retrieveSchema(ctx, config().schema, value(), true)
  );

  let lastSchemaProperties: Schema["properties"] = undefined;
  const schemaProperties = $derived.by(() => {
    const snap = snapshotWithSymbols(retrievedSchema.properties);
    // NOTE: Cache hits are verified on `any-of` and `property-dependencies` examples.
    if (!isOrderedSchemaDeepEqual(lastSchemaProperties, snap)) {
      // NOTE: `defaults` population
      if (lastSchemaProperties !== undefined) {
        markSchemaChange(ctx);
      }
      lastSchemaProperties = snap;
    }
    return lastSchemaProperties ?? EMPTY_SCHEMA_PROPERTIES;
  });

  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config(), opt);

  // Additional and pattern properties are stubbed into `schemaProperties` in
  // `Object.keys(formData)` order, so a key renamed to an integer-like string
  // would jump to the front. Keep the order they were added or renamed in.
  // This is deliberately not reactive state: it only has to survive until the
  // next `schemaProperties` update, which recalculates this derived value.
  const additionalPropertyOrder: string[] = [];
  // Classifying the properties is the expensive part, so keep it separate from
  // the tracked additional order and the `order` UI option, which can change
  // without changing `schemaProperties`.
  const schemaPropertyGroups = $derived.by(() => {
    // `order` is reused as the regular properties array and must stay
    // immutable once returned.
    const order = Object.keys(schemaProperties);
    const additional = new Set<string>();
    let definedCount = 0;
    for (const key of order) {
      if (isAdditionalProperty(schemaProperties, key)) {
        additional.add(key);
      } else {
        order[definedCount++] = key;
      }
    }
    order.length = definedCount;
    return { order, additional };
  });

  const schemaPropertiesOrder = $derived.by(() => {
    const { order: definedOrder, additional } = schemaPropertyGroups;

    // Reconcile the tracked order in place: drop removed keys, keep the rest in
    // order, then append new keys in the order `Object.keys` reported them.
    let write = 0;
    for (const key of additionalPropertyOrder) {
      if (additional.has(key)) {
        additionalPropertyOrder[write++] = key;
      }
    }
    additionalPropertyOrder.length = write;
    if (additionalPropertyOrder.length !== additional.size) {
      const tracked = new Set(additionalPropertyOrder);
      for (const key of additional) {
        if (!tracked.has(key)) {
          additionalPropertyOrder.push(key);
        }
      }
    }

    // Reconcile even with a custom order, so the tracked order is correct if
    // the option is removed later.
    const uiOrder = uiOption("order");
    if (uiOrder !== undefined) {
      return orderProperties(schemaProperties, uiOrder);
    }
    const completeOrder = [...definedOrder];
    for (const key of additionalPropertyOrder) {
      completeOrder.push(key);
    }
    return orderProperties(schemaProperties, completeOrder);
  });

  const requiredProperties = $derived(new Set(retrievedSchema.required));

  // Keep the seed in step with the stub `retrieveSchema` puts in `properties`.
  function getAdditionalPropertySchema(
    val: SchemaObjectValue | null | undefined,
    key: string
  ): Schema {
    const keySchema = getSchemaForAdditionalProperty(retrievedSchema, key);
    if (keySchema === false) {
      return { type: "null" };
    }
    if (keySchema === true) {
      return {};
    }
    return retrieveSchema(ctx, keySchema, val);
  }

  const keyInputSchema: Schema = $derived.by(() => {
    const { propertyNames } = config().schema;
    return propertyNames !== undefined &&
      typeof propertyNames !== "boolean" &&
      getSimpleSchemaType(propertyNames) === "string"
      ? propertyNames
      : { type: "string" };
  });

  const additionalPropertiesUiSchema = $derived(
    retrieveUiSchema(ctx, config().uiSchema.additionalProperties)
  );

  const keyInputUiSchema = $derived(
    retrieveUiSchema(
      ctx,
      additionalPropertiesUiSchema.additionalPropertyKeyInput
    )
  );

  const availablePropertyKeys = $derived.by(() => {
    if (!isSelectSchema(ctx, keyInputSchema)) {
      return undefined;
    }
    const { options } = createFormOptions(
      ctx,
      config(),
      uiOption,
      keyInputSchema
    );
    const result = new Set<string>();
    for (const o of options) {
      if (typeof o.value === "string" && !(o.value in schemaProperties)) {
        result.add(o.value);
      }
    }
    return result;
  });

  const canExpand = $derived(
    uiOption("expandable") !== false &&
      isObjectSchemaExpandable(retrievedSchema, value()) &&
      (availablePropertyKeys === undefined || availablePropertyKeys.size > 0)
  );

  const errors = $derived(getFieldErrors(ctx, config().path));

  const newKeyPrefix = $derived(
    availablePropertyKeys?.values().next().value ??
      translate("additional-property", {})
  );

  function onChange(val: SchemaObjectValue | null | undefined) {
    setFieldState(ctx, config().path, FIELD_CHANGED);
    const m = getFieldsValidationMode(ctx);
    if (
      !(m & ON_OBJECT_CHANGE) ||
      (m & AFTER_VALIDATED && ctx.validation.status === "idle")
    ) {
      return;
    }
    validateField(ctx, config(), val);
  }

  const additionalPropertyKey = $derived(
    uiOption("additionalPropertyKey") ?? createAdditionalPropertyKey
  );

  // A rename overrides this derived value. Reading `value` makes a value
  // replaced from outside recalculate it as an empty map, discarding the
  // renames made against the replaced object.
  let renamedKeys = $derived.by<ReadonlyMap<string, string>>(() => {
    value();
    return new Map();
  });
  const heldRenamedKeys = $derived(
    collectHeldKeys(renamedKeys, schemaProperties)
  );

  function isEmptyValue(v: SchemaValue | undefined) {
    return (
      v === undefined || v === null || (Array.isArray(v) && v.length === 0)
    );
  }

  function isObjectCanBeRemoved(
    obj: SchemaObjectValue,
    removedProperty: string
  ) {
    return (
      !config().required &&
      Object.keys(obj).every(
        (k) => k === removedProperty || isEmptyValue(obj[k])
      )
    );
  }

  const isNullable = $derived(isSchemaNullable(config().schema));

  function removeObject() {
    setValue(isNullable ? null : undefined);
  }

  return {
    key(property) {
      return stableKeyOf(renamedKeys, property, heldRenamedKeys);
    },
    set(property, v) {
      const obj = value();
      if (!obj) {
        setValue({ [property]: v });
      } else if (isEmptyValue(v) && isObjectCanBeRemoved(obj, property)) {
        removeObject();
      } else {
        setValueAtPath(ctx, getChildPath(ctx, config().path, property), v);
      }
    },
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
      return isAdditionalProperty(schemaProperties, property);
    },
    propertyConfig(config, property, isAdditional) {
      const definition = schemaProperties[property] ?? false;
      const schema =
        typeof definition === "boolean"
          ? {}
          : retrieveSchema(ctx, definition, value()?.[property]);
      const uiSchema = isAdditional
        ? additionalPropertiesUiSchema
        : retrieveUiSchema(
            ctx,
            config.uiSchema[property] as UiSchemaDefinition | undefined
          );
      return getStableConfig(ctx, {
        path: getChildPath(ctx, config.path, property),
        title: uiTitleOption(ctx, uiSchema) ?? schema.title ?? property,
        schema,
        uiSchema,
        required: requiredProperties.has(property),
        value: () => value()?.[property],
      });
    },
    addProperty() {
      let val = value();
      const newKey = val
        ? generateNewKey(val, newKeyPrefix, additionalPropertyKey)
        : additionalPropertyKey(newKeyPrefix, 0);
      const additionalPropertySchema = getAdditionalPropertySchema(val, newKey);
      // When the extra-key keyword is a `$ref` and carries a sibling `default`,
      // forward that sibling's value as the seed formData so that
      // `getDefaultFormState` merges it with the defaults computed from the
      // resolved referenced schema (matching RJSF's ObjectField behavior).
      // NOTE: $ref + any other keyword => invalid draft 07 schema
      const extraKeyword = additionalPropertiesKeyword(retrievedSchema);
      const siblingDefault =
        typeof extraKeyword === "object" ? extraKeyword.default : undefined;
      const propValue =
        getDefaultFieldState(ctx, {
          schema: additionalPropertySchema,
          formData: siblingDefault,
        }) ??
        getDefaultValueForType(getSimpleSchemaType(additionalPropertySchema));
      if (val) {
        updateValueAtPath(ctx, config().path, (obj: SchemaObjectValue) => {
          obj[newKey] = propValue;
          return obj;
        });
      } else {
        val = { [newKey]: propValue };
        setValue(val);
      }
      additionalPropertyOrder.push(newKey);
      onChange(val);
    },
    removeProperty(prop) {
      const obj = value();
      if (!obj) {
        return;
      }
      const properties = schemaProperties;
      const orderIndex = additionalPropertyOrder.indexOf(prop);
      if (orderIndex !== -1) {
        additionalPropertyOrder.splice(orderIndex, 1);
      }
      if (isObjectCanBeRemoved(obj, prop)) {
        removeObject();
      } else {
        updateValueAtPath(ctx, config().path, (obj: SchemaObjectValue) => {
          delete obj[prop];
          return obj;
        });
        onChange(obj);
      }
      // The key it held goes free, but a property that took a variant of it
      // while it was held keeps that variant
      renamedKeys = withoutRenamedKey(renamedKeys, prop, properties);
    },
    renameProperty(oldProp, newProp = "", fieldConfig) {
      const val = value();
      if (oldProp === newProp || !val) {
        return;
      }
      // Read before the rename so that the held keys are those of the
      // properties the rename is applied to, not the ones it creates
      const heldKeys = heldRenamedKeys;
      const newKey = generateNewKey(val, newProp, additionalPropertyKey);
      if (!validateAdditionalPropertyKey(ctx, config(), newKey, fieldConfig)) {
        return;
      }
      const orderIndex = additionalPropertyOrder.indexOf(oldProp);
      if (orderIndex !== -1) {
        additionalPropertyOrder[orderIndex] = newKey;
      }
      updateValueAtPath(ctx, config().path, (obj: SchemaObjectValue) => {
        obj[newKey] = obj[oldProp];
        delete obj[oldProp];
        return obj;
      });
      renamedKeys = withRenamedKey(renamedKeys, oldProp, newKey, heldKeys);
      onChange(val);
    },
    keyInputSchemas() {
      return { schema: keyInputSchema, uiSchema: keyInputUiSchema };
    },
    isAvailablePropertyKey(key) {
      return availablePropertyKeys?.has(key) ?? false;
    },
  };
}
