import {
  CONST_KEY,
  DEFAULT_KEY,
  isSchemaObjectValue,
  isSchemaValueDeepEqual,
  type Merger,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
} from "#core/index.js";
import {
  getDefaultFieldState,
  retrieveSchema,
  sanitizeDataForNewSchema,
  type FormState,
} from "#form/index.js";
import { FORM_MERGER } from "#form/internals.js";

function withParentRequired(
  merger: Merger,
  parentSchema: Schema | undefined,
  option: Schema | undefined
) {
  if (!option || !parentSchema?.required) {
    return option;
  }
  return merger.mergeSchemas({ required: parentSchema.required }, option);
}

function declaresOwnValue(schema: Schema) {
  return Object.hasOwn(schema, DEFAULT_KEY) || Object.hasOwn(schema, CONST_KEY);
}

function propertySchema(option: Schema, key: string): Schema {
  const properties = option.properties;
  const property =
    properties && Object.hasOwn(properties, key) ? properties[key] : undefined;
  return typeof property === "object" ? property : {};
}

function optionDeclaresValueFor<T>(
  ctx: FormState<T>,
  option: Schema,
  key: string
) {
  const resolvedProperty = retrieveSchema(
    ctx,
    propertySchema(option, key),
    undefined
  );
  if (declaresOwnValue(resolvedProperty)) {
    return true;
  }
  const optionDefault = option[DEFAULT_KEY];
  return (
    isSchemaObjectValue(optionDefault) && Object.hasOwn(optionDefault, key)
  );
}

function defaultsFor<T>(
  ctx: FormState<T>,
  schema: Schema | undefined
): SchemaValue | undefined {
  return schema
    ? getDefaultFieldState(ctx, {
        schema,
        formData: undefined,
        includeUndefinedValues: "excludeObjectChildren",
      })
    : undefined;
}

export function formDataForNewOption<T>(
  ctx: FormState<T>,
  formData: SchemaValue | undefined,
  newOption: Schema | undefined,
  oldOption: Schema | undefined,
  parentSchema: Schema | undefined
): SchemaValue | undefined {
  let newFormData = sanitizeDataForNewSchema(
    ctx,
    newOption ?? {},
    oldOption ?? {},
    formData
  );
  const merger = ctx[FORM_MERGER];
  const newOptionForDefaults = withParentRequired(
    merger,
    parentSchema,
    newOption
  );
  if (!newOptionForDefaults) {
    return newFormData;
  }
  const oldOptionForDefaults = withParentRequired(
    merger,
    parentSchema,
    oldOption
  );
  let oldDefaults: SchemaValue | undefined;
  let oldDefaultsComputed = false;
  const defaultsForOldOption = () => {
    if (!oldDefaultsComputed) {
      oldDefaults = defaultsFor(ctx, oldOptionForDefaults);
      oldDefaultsComputed = true;
    }
    return oldDefaults;
  };
  let newDefaults: SchemaValue | undefined;
  let newDefaultsComputed = false;
  const defaultsForNewOption = () => {
    if (!newDefaultsComputed) {
      newDefaults = defaultsFor(ctx, newOptionForDefaults) ?? undefined;
      newDefaultsComputed = true;
    }
    return newDefaults;
  };
  if (isSchemaObjectValue(newFormData)) {
    const sanitizedData = newFormData;
    const oldData: SchemaObjectValue = isSchemaObjectValue(formData)
      ? formData
      : {};
    const carriedKeys = Object.keys(sanitizedData).filter(
      (key) => Object.hasOwn(oldData, key) && oldData[key] !== undefined
    );
    if (carriedKeys.length > 0) {
      const optionDefaults = defaultsForNewOption();
      const newDefaultsData: SchemaObjectValue = isSchemaObjectValue(
        optionDefaults
      )
        ? optionDefaults
        : {};
      const refillableKeys = carriedKeys.filter(
        (key) =>
          Object.hasOwn(newDefaultsData, key) &&
          newDefaultsData[key] !== undefined &&
          optionDeclaresValueFor(ctx, newOptionForDefaults, key)
      );
      if (refillableKeys.length > 0) {
        const holdsOldDefault = (key: string) => {
          if (
            !oldOptionForDefaults ||
            !optionDeclaresValueFor(ctx, oldOptionForDefaults, key)
          ) {
            return false;
          }
          const computed = defaultsForOldOption();
          return (
            isSchemaObjectValue(computed) &&
            Object.hasOwn(computed, key) &&
            isSchemaValueDeepEqual(computed[key], oldData[key])
          );
        };
        const withoutBlockedKeys = { ...sanitizedData };
        refillableKeys.forEach((key) => {
          if (sanitizedData[key] === undefined || holdsOldDefault(key)) {
            delete withoutBlockedKeys[key];
          }
        });
        newFormData = withoutBlockedKeys;
      }
    }
  } else if (
    newFormData !== undefined &&
    oldOptionForDefaults &&
    declaresOwnValue(newOptionForDefaults) &&
    declaresOwnValue(oldOptionForDefaults) &&
    isSchemaValueDeepEqual(defaultsForOldOption(), formData) &&
    defaultsForNewOption() !== undefined
  ) {
    newFormData = undefined;
  }
  return newFormData === undefined
    ? defaultsForNewOption()
    : getDefaultFieldState(ctx, {
        schema: newOptionForDefaults,
        formData: newFormData,
        includeUndefinedValues: "excludeObjectChildren",
      });
}
