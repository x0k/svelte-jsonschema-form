// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getDefaultFormState.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isEmptyRecord, isObject } from "@/lib/object.js";

import { resolveDependencies, retrieveSchema } from "./resolve.js";
import {
  ALL_OF_KEY,
  DEPENDENCIES_KEY,
  isSchema,
  type Schema,
  type SchemaArrayValue,
  type SchemaObjectValue,
  type SchemaType,
  type SchemaValue,
} from "./schema.js";
import type { Validator } from "./validator.js";
import { findSchemaDefinition } from "./definitions.js";
import { isFixedItems } from "./is-fixed-items.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { isSchemaObjectValue, isSchemaValueEmpty } from "./value.js";
import {
  mergeDefaultsWithFormData,
  mergeSchemaObjects,
  mergeSchemas,
} from "./merge.js";
import {
  getSimpleSchemaType,
  isPrimitiveSchemaType,
  typeOfSchema,
} from "./type.js";
import { getSelectOptionValues, isMultiSelect, isSelect } from "./is-select.js";
import { getClosestMatchingOption } from "./matching.js";
import type { Merger } from "./merger.js";
import { isSchemaOfConstantValue } from "./constant-schema.js";
import { isSchemaValueDeepEqual } from "./deep-equal.js";

export function getDefaultValueForType(type: SchemaType) {
  switch (type) {
    case "array":
      return [];
    case "object":
      return {};
    case "boolean":
      return false;
    case "integer":
    case "number":
      return 0;
    case "string":
      return "";
    case "null":
      return null;
    default:
      const n: never = type;
      throw new Error(`Unsupported schema type: ${n}`);
  }
}

export function getDefaultFormState(
  validator: Validator,
  merger: Merger,
  theSchema: Schema,
  formData: SchemaValue | undefined = undefined,
  rootSchema: Schema = {},
  includeUndefinedValues: boolean | "excludeObjectChildren" = false,
  experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior = {}
): SchemaValue | undefined {
  const schema = retrieveSchema(
    validator,
    merger,
    theSchema,
    rootSchema,
    formData
  );
  // Get the computed defaults with 'shouldMergeDefaultsIntoFormData' set to true to merge defaults into formData.
  // This is done when for example the value from formData does not exist in the schema 'enum' property, in such
  // cases we take the value from the defaults because the value from the formData is not valid.
  const defaults = computeDefaults(validator, merger, schema, {
    rootSchema,
    includeUndefinedValues,
    experimental_defaultFormStateBehavior,
    rawFormData: formData,
    parentDefaults: undefined,
    required: false,
    isSchemaRoot: true,
    stack: new Set<string>(),
    shouldMergeDefaultsIntoFormData: true,
  });

  // WARN: How about fixed arrays?
  if (
    schema.type !== "object" &&
    isSchemaObjectValue(schema.default) &&
    // CHANGED: Added those conditions for typesafety, while original intentions is unknown
    (defaults === undefined || typeof defaults === "object") &&
    (formData === undefined || typeof formData === "object")
  ) {
    return {
      ...defaults,
      ...formData,
    };
  }

  // If the formData is an object or an array, add additional properties from formData and override formData with
  // defaults since the defaults are already merged with formData.
  if (isSchemaObjectValue(formData) || Array.isArray(formData)) {
    const { mergeDefaultsIntoFormData } =
      experimental_defaultFormStateBehavior || {};
    const defaultSupersedesUndefined =
      mergeDefaultsIntoFormData === "useDefaultIfFormDataUndefined";
    const result = mergeDefaultsWithFormData(
      defaults,
      formData,
      true, // set to true to add any additional default array entries.
      defaultSupersedesUndefined,
      true // set to true to override formData with defaults if they exist.
    );
    return result;
  }

  return defaults;
}

export type Experimental_ArrayMinItems = {
  /** Optional enumerated flag controlling how array minItems are populated, defaulting to `all`:
   * - `all`: Legacy behavior, populate minItems entries with default values initially and include an empty array when
   *        no values have been defined.
   * - `requiredOnly`: Ignore `minItems` on a field when calculating defaults unless the field is required.
   * - `never`: Ignore `minItems` on a field even the field is required.
   */
  populate?: "all" | "requiredOnly" | "never";
  /** A function that determines whether to skip populating the array with default values based on the provided validator,
   * schema, and root schema.
   * If the function returns true, the array will not be populated with default values.
   * If the function returns false, the array will be populated with default values according to the `populate` option.
   * @param validator - An implementation of the `ValidatorType` interface that is used to detect valid schema conditions
   * @param schema - The schema for which resolving a condition is desired
   * @param [rootSchema] - The root schema that will be forwarded to all the APIs
   * @returns A boolean indicating whether to skip populating the array with default values.
   */
  computeSkipPopulate?: (
    validator: Validator,
    schema: Schema,
    rootSchema?: Schema
  ) => boolean;
  /** When `formData` is provided and does not contain `minItems` worth of data, this flag (`false` by default) controls
   * whether the extra data provided by the defaults is appended onto the existing `formData` items to ensure the
   * `minItems` condition is met. When false (legacy behavior), only the `formData` provided is merged into the default
   * form state, even if there are fewer than the `minItems`. When true, the defaults are appended onto the end of the
   * `formData` until the `minItems` condition is met.
   */
  mergeExtraDefaults?: boolean;
};

export type Experimental_DefaultFormStateBehavior = {
  /** Optional object, that controls how the default form state for arrays with `minItems` is handled. When not provided
   * it defaults to `{ populate: 'all' }`.
   */
  arrayMinItems?: Experimental_ArrayMinItems;
  /** Optional enumerated flag controlling how empty object fields are populated, defaulting to `populateAllDefaults`:
   * - `populateAllDefaults`: Legacy behavior - set default when there is a primitive value, an non-empty object field,
   *        or the field itself is required  |
   * - `populateRequiredDefaults`: Only sets default when a value is an object and its parent field is required, or it
   *        is a primitive value and it is required |
   * - `skipDefaults`: Does not set defaults                                                                                                      |
   * - `skipEmptyDefaults`: Does not set an empty default. It will still apply the default value if a default property is defined in your schema.                                                                                                 |
   */
  emptyObjectFields?:
    | "populateAllDefaults"
    | "populateRequiredDefaults"
    | "skipDefaults"
    | "skipEmptyDefaults";
  /**
   * Optional flag to compute the default form state using allOf and if/then/else schemas. Defaults to `skipDefaults'.
   */
  allOf?: "populateDefaults" | "skipDefaults";
  /** Optional enumerated flag controlling how the defaults are merged into the form data when dealing with undefined
   * values, defaulting to `useFormDataIfPresent`.
   * NOTE: If there is a default for a field and the `formData` is unspecified, the default ALWAYS merges.
   * - `useFormDataIfPresent`: Legacy behavior - Do not merge defaults if there is a value for a field in `formData`,
   *        even if that value is explicitly set to `undefined`
   * - `useDefaultIfFormDataUndefined`: - If the value of a field within the `formData` is `undefined`, then use the
   *        default value instead
   */
  mergeDefaultsIntoFormData?:
    | "useFormDataIfPresent"
    | "useDefaultIfFormDataUndefined";
  /** Optional enumerated flag controlling how const values are merged into the form data as defaults when dealing with
   * undefined values, defaulting to `always`. The defaulting behavior for this flag will always be controlled by the
   * `emptyObjectField` flag value. For instance, if `populateRequiredDefaults` is set and the const value is not
   * required, it will not be set.
   * - `always`: A const value will always be merged into the form as a default. If there is are const values in a
   *        `oneOf` (for instance to create an enumeration with title different from the values), the first const value
   *        will be defaulted
   * - `skipOneOf`: If const is in a `oneOf` it will NOT pick the first value as a default
   * - `never`: A const value will never be used as a default
   *
   */
  constAsDefaults?: "always" | "skipOneOf" | "never";
};

interface ComputeDefaultsProps<FormData = SchemaValue | undefined> {
  parentDefaults: SchemaValue | undefined;
  rootSchema: Schema;
  rawFormData: FormData;
  includeUndefinedValues: boolean | "excludeObjectChildren";
  stack: Set<string>;
  experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior;
  isSchemaRoot: boolean;
  required: boolean;
  /**
   * flag, if true, It will merge defaults into formData.
   * The formData should take precedence unless it's not valid. This is useful when for example the value from formData does not exist in the schema 'enum' property, in such cases we take the value from the defaults because the value from the formData is not valid.
   */
  shouldMergeDefaultsIntoFormData: boolean;
}

export function computeDefaults(
  validator: Validator,
  merger: Merger,
  rawSchema: Schema,
  computeDefaultsProps: ComputeDefaultsProps
): SchemaValue | undefined {
  const {
    parentDefaults,
    rawFormData,
    rootSchema,
    includeUndefinedValues,
    stack,
    experimental_defaultFormStateBehavior,
    required,
    isSchemaRoot,
    shouldMergeDefaultsIntoFormData,
  } = computeDefaultsProps;
  const rawDataIsObject = isSchemaObjectValue(rawFormData);
  const formData: SchemaObjectValue = rawDataIsObject ? rawFormData : {};
  const schema: Schema = isSchemaObjectValue(rawSchema) ? rawSchema : {};
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults;
  // If we get a new schema, then we need to recompute defaults again for the new schema found.
  let schemaToCompute: Schema | null = null;
  // CHANGED: introduced to typesafely adapt https://github.com/rjsf-team/react-jsonschema-form/pull/4626
  let schemaToComputeFormData: SchemaValue | undefined = formData;
  let experimentalBehaviorToCompute = experimental_defaultFormStateBehavior;
  let nextStack = stack;

  const {
    default: schemaDefault,
    $ref: schemaRef,
    oneOf: schemaOneOf,
    anyOf: schemaAnyOf,
    allOf: schemaAllOf,
  } = schema;
  if (
    isSchemaOfConstantValue(schema) &&
    experimental_defaultFormStateBehavior.constAsDefaults !== "never"
  ) {
    defaults = schema.const ?? schema.enum?.[0];
  } else if (
    isSchemaObjectValue(defaults) &&
    isSchemaObjectValue(schemaDefault)
  ) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeSchemaObjects(defaults, schemaDefault);
  } else if (
    schemaDefault !== undefined &&
    schemaOneOf === undefined &&
    schemaAnyOf === undefined &&
    schemaRef === undefined
  ) {
    defaults = schemaDefault;
  } else if (schemaRef !== undefined) {
    // Use referenced schema defaults for this node.
    if (!stack.has(schemaRef)) {
      nextStack = new Set(stack).add(schemaRef);
      schemaToCompute = findSchemaDefinition(schemaRef, rootSchema);
    }
    // If the referenced schema exists and parentDefaults is not set
    // Then set the defaults from the current schema for the referenced schema
    if (schemaToCompute && defaults === undefined) {
      defaults = schemaDefault;
    }
    // If shouldMergeDefaultsIntoFormData is true
    // And the schemaToCompute is set and the rawFormData is not an object
    // Then set the formData to the rawFormData
    if (
      shouldMergeDefaultsIntoFormData &&
      schemaToCompute &&
      !rawDataIsObject
    ) {
      schemaToComputeFormData = rawFormData;
    }
  } else if (DEPENDENCIES_KEY in schema) {
    // Get the default if set from properties to ensure the dependencies conditions are resolved based on it
    const defaultFormData = {
      ...getObjectDefaults(
        validator,
        merger,
        schema,
        {
          ...computeDefaultsProps,
          rawFormData: formData,
        },
        defaults
      ),
      ...formData,
    };
    // Get the default if set from properties to ensure the dependencies conditions are resolved based on it
    const resolvedSchema = resolveDependencies(
      validator,
      merger,
      schema,
      rootSchema,
      false,
      new Set(),
      defaultFormData
    );
    schemaToCompute = resolvedSchema[0]!; // pick the first element from resolve dependencies
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map((itemSchema, idx) =>
      computeDefaults(validator, merger, itemSchema, {
        rootSchema,
        includeUndefinedValues,
        stack,
        experimental_defaultFormStateBehavior,
        parentDefaults: Array.isArray(parentDefaults)
          ? parentDefaults[idx]
          : undefined,
        rawFormData: formData,
        required,
        isSchemaRoot: false,
        shouldMergeDefaultsIntoFormData,
      })
    );
  } else if (schemaOneOf !== undefined) {
    const { oneOf: _, ...remaining } = schema;
    if (schemaOneOf.length === 0) {
      return undefined;
    }
    const schemaType = typeOfSchema(schema);
    if (
      (Array.isArray(schemaType)
        ? schemaType.every(isPrimitiveSchemaType)
        : isPrimitiveSchemaType(schemaType)) &&
      experimentalBehaviorToCompute?.constAsDefaults === "skipOneOf"
    ) {
      // If we are in a oneOf of a primitive type, then we want to pass constAsDefaults as 'never' for the recursion
      experimentalBehaviorToCompute = {
        ...experimentalBehaviorToCompute,
        constAsDefaults: "never",
      };
    }
    const nextSchema =
      schemaOneOf[
        getClosestMatchingOption(
          validator,
          merger,
          rootSchema,
          rawFormData ?? schemaDefault,
          schemaOneOf.filter(isSchema),
          0,
          getDiscriminatorFieldFromSchema(schema)
        )
      ]!;
    if (typeof nextSchema === "boolean") {
      return undefined;
    }
    schemaToCompute = mergeSchemas(remaining, nextSchema);
  } else if (schemaAnyOf !== undefined) {
    const { anyOf: _, ...remaining } = schema;
    if (schemaAnyOf.length === 0) {
      return undefined;
    }
    const nextSchema =
      schemaAnyOf[
        getClosestMatchingOption(
          validator,
          merger,
          rootSchema,
          rawFormData ?? schemaDefault,
          schemaAnyOf.filter(isSchema),
          0,
          getDiscriminatorFieldFromSchema(schema)
        )
      ]!;
    if (typeof nextSchema === "boolean") {
      return undefined;
    }
    schemaToCompute = mergeSchemas(remaining, nextSchema);
  }

  if (schemaToCompute) {
    return computeDefaults(validator, merger, schemaToCompute, {
      isSchemaRoot,
      rootSchema,
      includeUndefinedValues,
      stack: nextStack,
      experimental_defaultFormStateBehavior: experimentalBehaviorToCompute,
      parentDefaults: defaults,
      rawFormData: rawFormData ?? schemaToComputeFormData,
      required,
      shouldMergeDefaultsIntoFormData,
    });
  }

  // No defaults defined for this node, fallback to generic typed ones.
  if (defaults === undefined) {
    defaults = schema.default;
  }

  let defaultsWithFormData =
    getDefaultBasedOnSchemaType(
      validator,
      merger,
      schema,
      computeDefaultsProps,
      defaults
    ) ?? defaults;
  // if shouldMergeDefaultsIntoFormData is true, then merge the defaults into the formData.
  if (shouldMergeDefaultsIntoFormData) {
    const { arrayMinItems = {} } = experimental_defaultFormStateBehavior || {};
    const { mergeExtraDefaults } = arrayMinItems;

    const matchingFormData = ensureFormDataMatchingSchema(
      validator,
      merger,
      schema,
      rootSchema,
      rawFormData,
      experimental_defaultFormStateBehavior
    );
    if (!isSchemaObjectValue(rawFormData) || schemaAllOf !== undefined) {
      defaultsWithFormData = mergeDefaultsWithFormData(
        defaultsWithFormData,
        matchingFormData,
        mergeExtraDefaults,
        true
      );
    }
  }

  return defaultsWithFormData;
}

/**
 * Ensure that the formData matches the given schema. If it's not matching in the case of a selectField, we change it to match the schema.
 *
 * @param validator - an implementation of the `ValidatorType` interface that will be used when necessary
 * @param schema - The schema for which the formData state is desired
 * @param rootSchema - The root schema, used to primarily to look up `$ref`s
 * @param formData - The current formData
 * @param experimental_defaultFormStateBehavior - Optional configuration object, if provided, allows users to override default form state behavior
 * @returns - valid formData that matches schema
 */
export function ensureFormDataMatchingSchema(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  formData: SchemaValue | undefined,
  experimental_defaultFormStateBehavior?: Experimental_DefaultFormStateBehavior
): SchemaValue | undefined {
  let validFormData = formData;
  const isSelectField =
    formData !== undefined &&
    !isSchemaOfConstantValue(schema) &&
    isSelect(validator, merger, schema, rootSchema);
  if (isSelectField) {
    const selectOptionValues = getSelectOptionValues(schema);
    const isValid = selectOptionValues?.some((v) =>
      isSchemaValueDeepEqual(v, formData)
    );
    validFormData = isValid ? formData : undefined;
  }

  // Override the formData with the const if the constAsDefaults is set to always
  const constTakesPrecedence =
    schema.const !== undefined &&
    experimental_defaultFormStateBehavior?.constAsDefaults === "always";
  if (constTakesPrecedence) {
    validFormData = schema.const;
  }

  return validFormData;
}

function maybeAddDefaultToObject(
  obj: Map<string, SchemaValue | undefined>,
  key: string,
  computedDefault: SchemaValue | undefined,
  includeUndefinedValues: boolean | "excludeObjectChildren",
  isConst: boolean,
  isSchemaRoot: boolean,
  isParentRequired: boolean,
  requiredFields: Set<string>,
  experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior
) {
  const { emptyObjectFields = "populateAllDefaults" } =
    experimental_defaultFormStateBehavior;
  if (includeUndefinedValues === true || isConst) {
    // If includeUndefinedValues is explicitly true
    // Or if the schema has a const property defined, then we should always return the computedDefault since it's coming from the const.
    obj.set(key, computedDefault);
  } else if (includeUndefinedValues === "excludeObjectChildren") {
    // Fix for Issue #4709: When in 'excludeObjectChildren' mode, don't set primitive fields to empty objects
    // Only add the computed default if it's not an empty object placeholder for a primitive field
    if (
      Array.isArray(computedDefault)
        ? computedDefault.length > 0
        : !isObject(computedDefault) || !isEmptyRecord(computedDefault)
    ) {
      obj.set(key, computedDefault);
    }
    // If computedDefault is an empty object {}, don't add it - let the field stay undefined
  } else if (emptyObjectFields !== "skipDefaults") {
    // If isParentRequired is undefined, then we are at the root level of the schema so defer to the requiredness of
    // the field key itself in the `requiredField` list
    const isSelfOrParentRequired = isSchemaRoot
      ? requiredFields.has(key)
      : isParentRequired;

    if (isSchemaObjectValue(computedDefault)) {
      // If emptyObjectFields 'skipEmptyDefaults' store computedDefault if it's a non-empty object(e.g. not {})
      if (emptyObjectFields === "skipEmptyDefaults") {
        if (!isSchemaValueEmpty(computedDefault)) {
          obj.set(key, computedDefault);
        }
      }
      // Else store computedDefault if it's a non-empty object(e.g. not {}) and satisfies certain conditions
      // Condition 1: If computedDefault is not empty or if the key is a required field
      // Condition 2: If the parent object is required or emptyObjectFields is not 'populateRequiredDefaults'
      else if (
        (!isSchemaValueEmpty(computedDefault) || requiredFields.has(key)) &&
        (isSelfOrParentRequired ||
          emptyObjectFields !== "populateRequiredDefaults")
      ) {
        obj.set(key, computedDefault);
      }
    } else if (
      // Store computedDefault if it's a defined primitive (e.g., true) and satisfies certain conditions
      // Condition 1: computedDefault is not undefined
      // Condition 2: If emptyObjectFields is 'populateAllDefaults' or 'skipEmptyDefaults) or if the key is a required field
      computedDefault !== undefined &&
      (emptyObjectFields === "populateAllDefaults" ||
        emptyObjectFields === "skipEmptyDefaults" ||
        (isSelfOrParentRequired && requiredFields.has(key)))
    ) {
      obj.set(key, computedDefault);
    }
  }
}

export enum AdditionalItemsHandling {
  Ignore,
  Invert,
  Fallback,
}

export function getInnerSchemaForArrayItem(
  schema: Schema,
  additionalItems: AdditionalItemsHandling = AdditionalItemsHandling.Ignore,
  idx = -1
): Schema {
  if (idx >= 0) {
    if (Array.isArray(schema.items) && idx < schema.items.length) {
      const item = schema.items[idx]!;
      if (typeof item !== "boolean") {
        return item;
      }
    }
  } else if (
    schema.items &&
    !Array.isArray(schema.items) &&
    typeof schema.items !== "boolean"
  ) {
    return schema.items;
  }
  if (
    additionalItems !== AdditionalItemsHandling.Ignore &&
    isSchemaObjectValue(schema.additionalItems)
  ) {
    return schema.additionalItems;
  }
  return {};
}

export function getDefaultBasedOnSchemaType(
  validator: Validator,
  merger: Merger,
  rawSchema: Schema,
  computeDefaultsProps: ComputeDefaultsProps,
  defaults: SchemaValue | undefined
): SchemaValue | undefined {
  switch (getSimpleSchemaType(rawSchema)) {
    // We need to recurse for object schema inner default values.
    case "object": {
      const { rawFormData } = computeDefaultsProps;
      return getObjectDefaults(
        validator,
        merger,
        rawSchema,
        {
          ...computeDefaultsProps,
          rawFormData: isSchemaObjectValue(rawFormData) ? rawFormData : {},
        },
        defaults
      );
    }
    case "array": {
      return getArrayDefaults(
        validator,
        merger,
        rawSchema,
        computeDefaultsProps,
        Array.isArray(defaults) ? defaults : undefined
      );
    }
    default:
      return undefined;
  }
}

export function getObjectDefaults(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  {
    rootSchema,
    includeUndefinedValues,
    stack,
    experimental_defaultFormStateBehavior,
    required,
    isSchemaRoot,
    rawFormData: formData,
    shouldMergeDefaultsIntoFormData,
  }: ComputeDefaultsProps<SchemaObjectValue>,
  defaults: SchemaValue | undefined
): SchemaObjectValue {
  // This is a custom addition that fixes this issue:
  // https://github.com/rjsf-team/react-jsonschema-form/issues/3832
  const retrievedSchema =
    experimental_defaultFormStateBehavior?.allOf === "populateDefaults" &&
    ALL_OF_KEY in schema
      ? retrieveSchema(validator, merger, schema, rootSchema, formData)
      : schema;
  const retrievedSchemaRequired = new Set(retrievedSchema.required);
  const parentConstObject = isSchemaObjectValue(retrievedSchema.const)
    ? retrievedSchema.const
    : {};
  const objDefaults = new Map<string, SchemaValue | undefined>();
  const schemaProperties = retrievedSchema.properties;
  const defaultsAsObject = isSchemaObjectValue(defaults) ? defaults : undefined;
  const formDataAsObject = isSchemaObjectValue(formData) ? formData : undefined;
  if (schemaProperties !== undefined) {
    for (const [key, value] of Object.entries(schemaProperties)) {
      if (typeof value === "boolean") {
        continue;
      }
      const computedDefault = computeDefaults(validator, merger, value, {
        rootSchema,
        stack,
        experimental_defaultFormStateBehavior,
        includeUndefinedValues: includeUndefinedValues === true,
        parentDefaults: defaultsAsObject?.[key],
        rawFormData: formDataAsObject?.[key],
        required: retrievedSchemaRequired.has(key),
        isSchemaRoot: false,
        shouldMergeDefaultsIntoFormData,
      });
      const isConst =
        (value.const !== undefined || parentConstObject[key] !== undefined) &&
        experimental_defaultFormStateBehavior.constAsDefaults !== "never";
      maybeAddDefaultToObject(
        objDefaults,
        key,
        computedDefault,
        includeUndefinedValues,
        isConst,
        isSchemaRoot,
        required,
        new Set(retrievedSchema.required),
        experimental_defaultFormStateBehavior
      );
    }
  }
  const schemaAdditionalProperties = retrievedSchema.additionalProperties;
  if (schemaAdditionalProperties !== undefined) {
    let keys = new Set(
      isSchemaObjectValue(defaults)
        ? schemaProperties === undefined
          ? Object.keys(defaults)
          : Object.keys(defaults).filter((key) => !(key in schemaProperties))
        : undefined
    );
    const formDataKeys = Object.keys(formData);
    const formDataRequired = new Set(
      schemaProperties === undefined
        ? formDataKeys
        : formDataKeys.filter((key) => !(key in schemaProperties))
    );
    keys = keys.union(formDataRequired);
    const additionalPropertySchema =
      typeof schemaAdditionalProperties === "boolean"
        ? {}
        : schemaAdditionalProperties;
    keys.forEach((key) => {
      const computedDefault = computeDefaults(
        validator,
        merger,
        additionalPropertySchema,
        {
          rootSchema,
          stack: stack,
          experimental_defaultFormStateBehavior,
          includeUndefinedValues: includeUndefinedValues === true,
          parentDefaults: defaultsAsObject?.[key],
          rawFormData: formDataAsObject?.[key],
          required: retrievedSchemaRequired.has(key),
          isSchemaRoot,
          shouldMergeDefaultsIntoFormData,
        }
      );
      // Since these are additional properties we don't need to add the `experimental_defaultFormStateBehavior` prop
      maybeAddDefaultToObject(
        objDefaults,
        key,
        computedDefault,
        includeUndefinedValues,
        false,
        isSchemaRoot,
        required,
        formDataRequired,
        {}
      );
    });
  }
  return Object.fromEntries(objDefaults);
}

export function getArrayDefaults(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  {
    rawFormData,
    rootSchema,
    stack,
    experimental_defaultFormStateBehavior,
    required,
    shouldMergeDefaultsIntoFormData,
  }: ComputeDefaultsProps,
  defaults: SchemaArrayValue | undefined
): SchemaArrayValue | undefined {
  const {
    populate: arrayMinItemsPopulate,
    mergeExtraDefaults: arrayMergeExtraDefaults,
    computeSkipPopulate = () => false,
  } = experimental_defaultFormStateBehavior?.arrayMinItems ?? {};

  const neverPopulate = arrayMinItemsPopulate === "never";
  const ignoreMinItemsFlagSet = arrayMinItemsPopulate === "requiredOnly";
  const isPopulateAll =
    arrayMinItemsPopulate === "all" ||
    (!neverPopulate && !ignoreMinItemsFlagSet);
  const isSkipEmptyDefaults =
    experimental_defaultFormStateBehavior?.emptyObjectFields ===
    "skipEmptyDefaults";

  const emptyDefault: SchemaArrayValue | undefined = isSkipEmptyDefaults
    ? undefined
    : [];

  // Inject defaults into existing array defaults
  if (defaults !== undefined) {
    defaults = defaults.map((item, idx) => {
      const schemaItem = getInnerSchemaForArrayItem(
        schema,
        AdditionalItemsHandling.Fallback,
        idx
      );
      return computeDefaults(validator, merger, schemaItem, {
        rootSchema,
        stack,
        experimental_defaultFormStateBehavior,
        parentDefaults: item,
        required,
        includeUndefinedValues: false,
        rawFormData: undefined,
        isSchemaRoot: false,
        shouldMergeDefaultsIntoFormData,
      });
    });
  }

  // Deeply inject defaults into already existing form data
  if (Array.isArray(rawFormData)) {
    const schemaItem = getInnerSchemaForArrayItem(schema);
    if (neverPopulate) {
      defaults = rawFormData;
    } else {
      const itemDefaults = rawFormData.map((item, idx) => {
        return computeDefaults(validator, merger, schemaItem, {
          rootSchema,
          stack,
          experimental_defaultFormStateBehavior,
          rawFormData: item,
          parentDefaults: defaults?.[idx],
          required,
          includeUndefinedValues: false,
          isSchemaRoot: false,
          shouldMergeDefaultsIntoFormData,
        });
      });
      // If the populate 'requiredOnly' flag is set then we only merge and include extra defaults if they are required.
      // Or if populate 'all' is set we merge and include extra defaults.
      const mergeExtraDefaults =
        ((ignoreMinItemsFlagSet && required) || isPopulateAll) &&
        arrayMergeExtraDefaults === true;
      defaults = mergeDefaultsWithFormData(
        defaults,
        itemDefaults,
        mergeExtraDefaults
      );
    }
  }

  if (
    schema.const === undefined ||
    experimental_defaultFormStateBehavior.constAsDefaults === "never"
  ) {
    // Check if the schema has a const property defined, then we should always return the computedDefault since it's coming from the const.
    if (neverPopulate) {
      return defaults ?? emptyDefault;
    }
    if (ignoreMinItemsFlagSet && !required) {
      // If no form data exists or defaults are set leave the field empty/non-existent, otherwise
      // return form data/defaults
      return defaults;
    }
  }

  const defaultsLength = defaults?.length ?? 0;
  if (
    !schema.minItems ||
    isMultiSelect(validator, merger, schema, rootSchema) ||
    computeSkipPopulate(validator, schema, rootSchema) ||
    schema.minItems <= defaultsLength
  ) {
    return defaults ?? emptyDefault;
  }

  const fillerSchema = getInnerSchemaForArrayItem(
    schema,
    AdditionalItemsHandling.Invert
  );
  const fillerDefault = fillerSchema.default;

  // Calculate filler entries for remaining items (minItems - existing raw data/defaults)
  const fillerEntries = Array.from(
    { length: schema.minItems - defaultsLength },
    () =>
      computeDefaults(validator, merger, fillerSchema, {
        parentDefaults: fillerDefault,
        rootSchema,
        stack: stack,
        experimental_defaultFormStateBehavior,
        required,
        includeUndefinedValues: false,
        rawFormData: undefined,
        isSchemaRoot: false,
        shouldMergeDefaultsIntoFormData,
      })
  );
  // then fill up the rest with either the item default or empty, up to minItems
  return defaultsLength ? defaults!.concat(fillerEntries) : fillerEntries;
}
