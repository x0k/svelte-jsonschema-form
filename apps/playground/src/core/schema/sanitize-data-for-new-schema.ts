import {
  REF_KEY,
  type Schema,
  type SchemaArrayValue,
  type SchemaObjectValue,
  type SchemaValue,
} from "./schema";
import { retrieveSchema } from "./resolve";
import type { Validator } from "./validator";
import { isSchemaObjectValue } from "./value";

const NO_VALUE = Symbol("no Value");

function retrieveIfNeeded(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  formData?: SchemaValue
) {
  return schema[REF_KEY] !== undefined
    ? retrieveSchema(validator, schema, rootSchema, formData)
    : schema;
}

function sanitizeArrays(
  newSchema: Schema,
  oldSchemaItems: Schema,
  newSchemaItems: Schema,
  validator: Validator,
  rootSchema: Schema,
  data: SchemaArrayValue
) {
  const oldSchemaType = oldSchemaItems.type;
  const newSchemaType = newSchemaItems.type;
  if (!oldSchemaType || oldSchemaType === newSchemaType) {
    const maxItems = newSchema.maxItems ?? -1;
    if (newSchemaType === "object") {
      return data.reduce((newValue: SchemaArrayValue, aValue) => {
        const itemValue = sanitizeDataForNewSchema(
          validator,
          rootSchema,
          newSchemaItems,
          oldSchemaItems,
          aValue
        );
        if (
          itemValue !== undefined &&
          (maxItems < 0 || newValue.length < maxItems)
        ) {
          newValue.push(itemValue);
        }
        return newValue;
      }, []);
    } else {
      return maxItems > 0 && data.length > maxItems
        ? data.slice(0, maxItems)
        : data;
    }
  }
  return NO_VALUE;
}

export function sanitizeDataForNewSchema(
  validator: Validator,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  data: SchemaValue | undefined
): SchemaValue | undefined {
  let newFormData;
  const newSchemaProperties = newSchema.properties;
  const isDataObject = isSchemaObjectValue(data);
  if (newSchemaProperties !== undefined) {
    const removeOldSchemaData: SchemaObjectValue = {};
    const oldSchemaProperties = oldSchema.properties;
    if (oldSchemaProperties !== undefined && isDataObject) {
      Object.keys(oldSchemaProperties).forEach((key) => {
        if (key in data) {
          removeOldSchemaData[key] = undefined;
        }
      });
    }
    const keys: string[] = Object.keys(newSchemaProperties);
    const nestedData: SchemaObjectValue = {};
    keys.forEach((key) => {
      const formValue = isDataObject ? data[key] : undefined;
      const oldKeyedSchemaDef = oldSchemaProperties?.[key];
      let oldKeyedSchema =
        typeof oldKeyedSchemaDef === "object" ? oldKeyedSchemaDef : {};
      const newKeyedSchemaDef = newSchemaProperties?.[key];
      let newKeyedSchema =
        typeof newKeyedSchemaDef === "object" ? newKeyedSchemaDef : {};
      oldKeyedSchema = retrieveIfNeeded(
        validator,
        oldKeyedSchema,
        rootSchema,
        formValue
      );
      newKeyedSchema = retrieveIfNeeded(
        validator,
        newKeyedSchema,
        rootSchema,
        formValue
      );

      const oldSchemaTypeForKey = oldKeyedSchema.type;
      const newSchemaTypeForKey = newKeyedSchema.type;
      if (!oldSchemaTypeForKey || oldSchemaTypeForKey === newSchemaTypeForKey) {
        if (key in removeOldSchemaData) {
          delete removeOldSchemaData[key];
        }
        if (
          newSchemaTypeForKey === "object" ||
          (newSchemaTypeForKey === "array" && Array.isArray(formValue))
        ) {
          const itemData = sanitizeDataForNewSchema(
            validator,
            rootSchema,
            newKeyedSchema,
            oldKeyedSchema,
            formValue
          );
          if (itemData !== undefined || newSchemaTypeForKey === "array") {
            nestedData[key] = itemData;
          }
        } else {
          // NOTE: `null` default is treated as `NO_VALUE`
          const newOptionDefault = newKeyedSchema.default ?? NO_VALUE;
          const oldOptionDefault = oldKeyedSchema.default ?? NO_VALUE;
          if (newOptionDefault !== NO_VALUE && newOptionDefault !== formValue) {
            if (oldOptionDefault === formValue) {
              removeOldSchemaData[key] = newOptionDefault;
            } else if (newKeyedSchema.readOnly === true) {
              removeOldSchemaData[key] = undefined;
            }
          }

          // NOTE: `null` const is treated as `NO_VALUE`
          const newOptionConst = newKeyedSchema.const ?? NO_VALUE;
          const oldOptionConst = oldKeyedSchema.const ?? NO_VALUE;
          if (newOptionConst !== NO_VALUE && newOptionConst !== formValue) {
            removeOldSchemaData[key] =
              oldOptionConst === formValue ? newOptionConst : undefined;
          }
        }
      }
    });

    newFormData = {
      ...(isDataObject ? data : undefined),
      ...removeOldSchemaData,
      ...nestedData,
    };
  } else if (
    oldSchema.type === "array" &&
    newSchema.type === "array" &&
    Array.isArray(data)
  ) {
    let oldSchemaItems = oldSchema.items;
    let newSchemaItems = newSchema.items;
    if (
      isSchemaObjectValue(oldSchemaItems) &&
      isSchemaObjectValue(newSchemaItems)
    ) {
      const newFormDataArray = sanitizeArrays(
        newSchema,
        retrieveIfNeeded(validator, oldSchemaItems, rootSchema, data),
        retrieveIfNeeded(validator, newSchemaItems, rootSchema, data),
        validator,
        rootSchema,
        data
      );
      if (newFormDataArray !== NO_VALUE) {
        newFormData = newFormDataArray;
      }
    } else if (
      typeof oldSchemaItems === "boolean" &&
      typeof newSchemaItems === "boolean" &&
      oldSchemaItems === newSchemaItems
    ) {
      // If they are both booleans and have the same value just return the data as is otherwise fall-thru to undefined
      newFormData = data;
    }
    // Also probably want to deal with `prefixItems` as tuples with the latest 2020 draft
  }
  return newFormData;
}
