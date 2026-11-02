import {
  CONST_KEY,
  DEFAULT_KEY,
  isSchemaObjectValue,
  isSchemaValueDeepEqual,
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

/**
 * Derives the form data for `newOption` from the data of `oldOption`.
 *
 * Both options must be the rendered variants from `getRenderedOptionSchema`,
 * so keywords inherited from the parent schema, especially `required`, are
 * already present when their defaults are computed.
 */
export function formDataForNewOption<T>(
  ctx: FormState<T>,
  formData: SchemaValue | undefined,
  newOption: Schema | undefined,
  oldOption: Schema | undefined
): SchemaValue | undefined {
  let newFormData = sanitizeDataForNewSchema(
    ctx,
    newOption ?? {},
    oldOption ?? {},
    formData
  );
  if (!newOption) {
    return newFormData;
  }
  let oldDefaults: SchemaValue | undefined;
  let oldDefaultsComputed = false;
  const defaultsForOldOption = () => {
    if (!oldDefaultsComputed) {
      oldDefaults = defaultsFor(ctx, oldOption);
      oldDefaultsComputed = true;
    }
    return oldDefaults;
  };
  let newDefaults: SchemaValue | undefined;
  let newDefaultsComputed = false;
  const defaultsForNewOption = () => {
    if (!newDefaultsComputed) {
      newDefaults = defaultsFor(ctx, newOption);
      newDefaultsComputed = true;
    }
    return newDefaults;
  };
  if (isSchemaObjectValue(newFormData)) {
    const sanitizedData = newFormData;
    const oldData: SchemaObjectValue = isSchemaObjectValue(formData)
      ? formData
      : {};
    let newDefaultsData: SchemaObjectValue | undefined;
    const holdsOldDefault = (key: string) => {
      if (!oldOption || !optionDeclaresValueFor(ctx, oldOption, key)) {
        return false;
      }
      const computed = defaultsForOldOption();
      return (
        isSchemaObjectValue(computed) &&
        Object.hasOwn(computed, key) &&
        isSchemaValueDeepEqual(computed[key], oldData[key])
      );
    };
    let withoutBlockedKeys: SchemaObjectValue | undefined;
    const keys = Object.keys(sanitizedData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      if (!Object.hasOwn(oldData, key) || oldData[key] === undefined) {
        continue;
      }
      if (newDefaultsData === undefined) {
        const optionDefaults = defaultsForNewOption();
        newDefaultsData = isSchemaObjectValue(optionDefaults)
          ? optionDefaults
          : {};
      }
      if (
        !Object.hasOwn(newDefaultsData, key) ||
        newDefaultsData[key] === undefined ||
        !optionDeclaresValueFor(ctx, newOption, key)
      ) {
        continue;
      }
      if (sanitizedData[key] !== undefined && !holdsOldDefault(key)) {
        continue;
      }
      withoutBlockedKeys ??= { ...sanitizedData };
      delete withoutBlockedKeys[key];
    }
    if (withoutBlockedKeys !== undefined) {
      newFormData = withoutBlockedKeys;
    }
  } else if (
    newFormData !== undefined &&
    oldOption &&
    declaresOwnValue(newOption) &&
    declaresOwnValue(oldOption) &&
    isSchemaValueDeepEqual(defaultsForOldOption(), formData) &&
    defaultsForNewOption() !== undefined
  ) {
    newFormData = undefined;
  }
  return newFormData === undefined
    ? defaultsForNewOption()
    : getDefaultFieldState(ctx, {
        schema: newOption,
        formData: newFormData,
        includeUndefinedValues: "excludeObjectChildren",
      });
}
