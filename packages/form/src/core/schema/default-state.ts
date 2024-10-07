// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getDefaultFormState.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { resolveDependencies, retrieveSchema } from "./resolve";
import {
  ALL_OF_KEY,
  DEPENDENCIES_KEY,
  isSchema,
  type Schema,
  type SchemaObjectValue,
  type SchemaType,
  type SchemaValue,
} from "./schema";
import type { Validator } from "./validator";
import { findSchemaDefinition } from "./definitions";
import { isFixedItems } from "./is-fixed-items";
import { getDiscriminatorFieldFromSchema } from "./discriminator";
import { isSchemaObjectValue, isSchemaValueEmpty } from "./value";
import {
  mergeDefaultsWithFormData,
  mergeSchemaObjects,
  mergeSchemas,
} from "./merge";
import { getSimpleSchemaType } from "./type";
import { isMultiSelect } from "./is-select";
import { getClosestMatchingOption } from "./matching";

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
  theSchema: Schema,
  formData?: SchemaValue,
  rootSchema?: Schema,
  includeUndefinedValues: boolean | "excludeObjectChildren" = false,
  experimental_defaultFormStateBehavior?: Experimental_DefaultFormStateBehavior
): SchemaValue | undefined {
  const schema = retrieveSchema(validator, theSchema, rootSchema, formData);
  const defaults = computeDefaults(validator, schema, {
    rootSchema,
    includeUndefinedValues,
    experimental_defaultFormStateBehavior,
    rawFormData: formData,
  });
  if (
    formData === undefined ||
    formData === null ||
    (typeof formData === "number" && isNaN(formData))
  ) {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isSchemaObjectValue(formData) || Array.isArray(formData)) {
    return mergeDefaultsWithFormData(
      defaults,
      formData,
      experimental_defaultFormStateBehavior?.arrayMinItems?.mergeExtraDefaults
    );
  }
  return formData;
}

type Experimental_ArrayMinItems = {
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

type Experimental_DefaultFormStateBehavior = {
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
};

interface ComputeDefaultsProps {
  parentDefaults?: SchemaValue;
  rootSchema?: Schema;
  rawFormData?: SchemaValue;
  includeUndefinedValues?: boolean | "excludeObjectChildren";
  stack?: Set<string>;
  experimental_defaultFormStateBehavior?: Experimental_DefaultFormStateBehavior;
  required?: boolean;
}

export function computeDefaults<T extends SchemaValue>(
  validator: Validator,
  rawSchema: Schema,
  {
    parentDefaults,
    rawFormData,
    rootSchema = {},
    includeUndefinedValues = false,
    stack = new Set(),
    experimental_defaultFormStateBehavior = undefined,
    required,
  }: ComputeDefaultsProps = {}
): SchemaValue | undefined {
  const formData: SchemaObjectValue = isSchemaObjectValue(rawFormData)
    ? rawFormData
    : {};
  const schema: Schema = isSchemaObjectValue(rawSchema) ? rawSchema : {};
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults: SchemaValue | undefined = parentDefaults;
  // If we get a new schema, then we need to recompute defaults again for the new schema found.
  let schemaToCompute: Schema | null = null;
  let nextStack = stack;

  const {
    default: schemaDefault,
    $ref: schemaRef,
    oneOf: schemaOneOf,
    anyOf: schemaAnyOf,
  } = schema;
  if (isSchemaObjectValue(defaults) && isSchemaObjectValue(schemaDefault)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeSchemaObjects(defaults, schemaDefault);
  } else if (schemaDefault !== undefined) {
    defaults = schemaDefault;
  } else if (schemaRef !== undefined) {
    // Use referenced schema defaults for this node.
    if (!stack.has(schemaRef)) {
      nextStack = new Set(stack).add(schemaRef);
      schemaToCompute = findSchemaDefinition(schemaRef, rootSchema);
    }
  } else if (DEPENDENCIES_KEY in schema) {
    const resolvedSchema = resolveDependencies(
      validator,
      schema,
      rootSchema,
      false,
      new Set(),
      formData
    );
    schemaToCompute = resolvedSchema[0]; // pick the first element from resolve dependencies
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map((itemSchema, idx) =>
      computeDefaults(validator, itemSchema, {
        rootSchema,
        includeUndefinedValues,
        stack: stack,
        experimental_defaultFormStateBehavior,
        parentDefaults: Array.isArray(parentDefaults)
          ? parentDefaults[idx]
          : undefined,
        rawFormData: formData,
        required,
      })
    ) as T[];
  } else if (schemaOneOf !== undefined) {
    const { oneOf: _, ...remaining } = schema;
    if (schemaOneOf.length === 0) {
      return undefined;
    }
    const nextSchema =
      schemaOneOf[
        getClosestMatchingOption(
          validator,
          rootSchema,
          isSchemaValueEmpty(formData) ? undefined : formData,
          schemaOneOf.filter(isSchema),
          0,
          getDiscriminatorFieldFromSchema(schema)
        )
      ];
    if (typeof nextSchema === "boolean") {
      return undefined;
    }
    schemaToCompute = mergeSchemas(remaining, nextSchema);
  } else if (schemaAnyOf !== undefined) {
    const { anyOf: _, ...remaining } = schema;
    if (schemaAnyOf.length === 0) {
      return undefined;
    }
    const discriminator = getDiscriminatorFieldFromSchema(schema);
    const nextSchema =
      schemaAnyOf[
        getClosestMatchingOption(
          validator,
          rootSchema,
          isSchemaValueEmpty(formData) ? undefined : formData,
          schemaAnyOf.filter(isSchema),
          0,
          discriminator
        )
      ];
    if (typeof nextSchema === "boolean") {
      return undefined;
    }
    schemaToCompute = mergeSchemas(remaining, nextSchema);
  }

  if (schemaToCompute) {
    return computeDefaults(validator, schemaToCompute, {
      rootSchema,
      includeUndefinedValues,
      stack: nextStack,
      experimental_defaultFormStateBehavior,
      parentDefaults: defaults,
      rawFormData: formData,
      required,
    });
  }

  // No defaults defined for this node, fallback to generic typed ones.
  if (defaults === undefined) {
    defaults = schema.default;
  }

  switch (getSimpleSchemaType(schema)) {
    // We need to recurse for object schema inner default values.
    case "object": {
      // This is a custom addition that fixes this issue:
      // https://github.com/rjsf-team/react-jsonschema-form/issues/3832
      const retrievedSchema =
        experimental_defaultFormStateBehavior?.allOf === "populateDefaults" &&
        ALL_OF_KEY in schema
          ? retrieveSchema(validator, schema, rootSchema, formData)
          : schema;
      const objDefaults = new Map<string, SchemaValue>();
      const schemaProperties = retrievedSchema.properties;
      const defaultsAsObject = isSchemaObjectValue(defaults)
        ? defaults
        : undefined;
      const formDataAsObject = isSchemaObjectValue(formData)
        ? formData
        : undefined;
      if (schemaProperties !== undefined) {
        for (const [key, value] of Object.entries(schemaProperties)) {
          if (typeof value === "boolean") {
            continue;
          }
          const computedDefault = computeDefaults(validator, value, {
            rootSchema,
            stack: stack,
            experimental_defaultFormStateBehavior,
            includeUndefinedValues: includeUndefinedValues === true,
            parentDefaults: defaultsAsObject?.[key],
            rawFormData: formDataAsObject?.[key],
            required: retrievedSchema.required?.includes(key),
          });
          maybeAddDefaultToObject(
            objDefaults,
            key,
            computedDefault,
            includeUndefinedValues,
            required,
            retrievedSchema.required,
            experimental_defaultFormStateBehavior
          );
        }
      }
      const schemaAdditionalProperties = retrievedSchema.additionalProperties;
      if (schemaAdditionalProperties !== undefined) {
        const keys = new Set(
          isSchemaObjectValue(defaults)
            ? schemaProperties === undefined
              ? Object.keys(defaults)
              : Object.keys(defaults).filter(
                  (key) => !(key in schemaProperties)
                )
            : undefined
        );
        const formDataKeys = Object.keys(formData);
        const formDataRequired =
          schemaProperties === undefined
            ? formDataKeys
            : formDataKeys.filter((key) => !(key in schemaProperties));
        for (const key of formDataRequired) {
          keys.add(key);
        }
        const additionalPropertySchema =
          typeof schemaAdditionalProperties === "boolean"
            ? {}
            : schemaAdditionalProperties;
        keys.forEach((key) => {
          const computedDefault = computeDefaults(
            validator,
            additionalPropertySchema,
            {
              rootSchema,
              stack: stack,
              experimental_defaultFormStateBehavior,
              includeUndefinedValues: includeUndefinedValues === true,
              parentDefaults: defaultsAsObject?.[key],
              rawFormData: formDataAsObject?.[key],
              required: retrievedSchema.required?.includes(key),
            }
          );
          // Since these are additional properties we don't need to add the `experimental_defaultFormStateBehavior` prop
          maybeAddDefaultToObject(
            objDefaults,
            key,
            computedDefault,
            includeUndefinedValues,
            required,
            formDataRequired
          );
        });
      }
      return Object.fromEntries(objDefaults);
    }
    case "array": {
      const neverPopulate =
        experimental_defaultFormStateBehavior?.arrayMinItems?.populate ===
        "never";
      const ignoreMinItemsFlagSet =
        experimental_defaultFormStateBehavior?.arrayMinItems?.populate ===
        "requiredOnly";
      const isSkipEmptyDefaults =
        experimental_defaultFormStateBehavior?.emptyObjectFields ===
        "skipEmptyDefaults";
      const computeSkipPopulate =
        experimental_defaultFormStateBehavior?.arrayMinItems
          ?.computeSkipPopulate ?? (() => false);

      const emptyDefault = isSkipEmptyDefaults ? undefined : [];

      // Inject defaults into existing array defaults
      if (Array.isArray(defaults)) {
        defaults = defaults.map((item, idx) => {
          const schemaItem = getInnerSchemaForArrayItem(
            schema,
            AdditionalItemsHandling.Fallback,
            idx
          );
          return computeDefaults(validator, schemaItem, {
            rootSchema,
            stack: stack,
            experimental_defaultFormStateBehavior,
            parentDefaults: item,
            required,
          });
        }) as T[];
      }

      // Deeply inject defaults into already existing form data
      if (Array.isArray(rawFormData)) {
        const schemaItem = getInnerSchemaForArrayItem(schema);
        if (neverPopulate) {
          defaults = rawFormData;
        } else {
          const defaultsAsArray = Array.isArray(defaults)
            ? defaults
            : undefined;
          defaults = rawFormData.map((item, idx) => {
            // TODO: Remove typecast by excluding `undefined` from the return type
            return computeDefaults(validator, schemaItem, {
              rootSchema,
              stack: stack,
              experimental_defaultFormStateBehavior,
              rawFormData: item,
              parentDefaults: defaultsAsArray?.[idx],
              required,
            });
          }) as T[];
        }
      }

      if (neverPopulate) {
        return defaults ?? emptyDefault;
      }
      if (ignoreMinItemsFlagSet && !required) {
        // If no form data exists or defaults are set leave the field empty/non-existent, otherwise
        // return form data/defaults
        return defaults ? defaults : undefined;
      }

      const defaultsLength = Array.isArray(defaults) ? defaults.length : 0;
      if (
        !schema.minItems ||
        isMultiSelect(validator, schema, rootSchema) ||
        computeSkipPopulate(validator, schema, rootSchema) ||
        schema.minItems <= defaultsLength
      ) {
        return defaults ? defaults : emptyDefault;
      }

      const defaultEntries = Array.isArray(defaults) ? defaults : [];
      const fillerSchema = getInnerSchemaForArrayItem(
        schema,
        AdditionalItemsHandling.Invert
      );
      const fillerDefault = fillerSchema.default;

      // Calculate filler entries for remaining items (minItems - existing raw data/defaults)
      const fillerEntries = new Array(schema.minItems - defaultsLength).fill(
        computeDefaults(validator, fillerSchema, {
          parentDefaults: fillerDefault,
          rootSchema,
          stack: stack,
          experimental_defaultFormStateBehavior,
          required,
        })
      );
      // then fill up the rest with either the item default or empty, up to minItems
      return defaultEntries.concat(fillerEntries);
    }
  }

  return defaults;
}

function maybeAddDefaultToObject(
  obj: Map<string, SchemaValue>,
  key: string,
  computedDefault: SchemaValue | undefined,
  includeUndefinedValues: boolean | "excludeObjectChildren",
  isParentRequired?: boolean,
  requiredFields: string[] = [],
  experimental_defaultFormStateBehavior: Experimental_DefaultFormStateBehavior = {}
) {
  const { emptyObjectFields = "populateAllDefaults" } =
    experimental_defaultFormStateBehavior;
  if (includeUndefinedValues) {
    if (computedDefault !== undefined) {
      obj.set(key, computedDefault);
    }
  } else if (emptyObjectFields !== "skipDefaults") {
    if (isSchemaObjectValue(computedDefault)) {
      // If isParentRequired is undefined, then we are at the root level of the schema so defer to the requiredness of
      // the field key itself in the `requiredField` list
      const isSelfOrParentRequired =
        isParentRequired === undefined
          ? requiredFields.includes(key)
          : isParentRequired;

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
        (!isSchemaValueEmpty(computedDefault) ||
          requiredFields.includes(key)) &&
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
        requiredFields.includes(key))
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
      const item = schema.items[idx];
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
