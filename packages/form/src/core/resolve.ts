// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/retrieveSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { array } from "@/lib/array.js";
import { isRecordEmpty } from "@/lib/object.js";
import { isSchemaObject } from "@/lib/json-schema/index.js";

import {
  ADDITIONAL_PROPERTY_FLAG,
  ALL_OF_KEY,
  ANY_OF_KEY,
  DEPENDENCIES_KEY,
  IF_KEY,
  ITEMS_KEY,
  ONE_OF_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type SchemaWithProperties,
} from "./schema.js";
import { findSchemaDefinition } from "./definitions.js";
import type { Validator } from "./validator.js";
import type { Merger } from "./merger.js";
import { typeOfValue } from "./type.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { getFirstMatchingOption } from "./matching.js";
import { isSchemaObjectValue } from "./value.js";
import { isSchemaDeepEqual } from "./deep-equal.js";

export function retrieveSchema(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema = {},
  formData?: SchemaValue
): Schema {
  return retrieveSchemaInternal(
    validator,
    merger,
    schema,
    rootSchema,
    formData
  )[0]!;
}

export function resolveAllReferences(
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  stack = new Set<string>()
): Schema {
  let resolvedSchema: Schema = schema;
  const ref = resolvedSchema[REF_KEY];
  if (ref) {
    if (stack.has(ref)) {
      return resolvedSchema;
    }
    stack.add(ref);
    const { [REF_KEY]: _, ...resolvedSchemaWithoutRef } = resolvedSchema;
    const schemaDef = findSchemaDefinition(merger, ref, rootSchema);
    return resolveAllReferences(
      merger,
      isRecordEmpty(resolvedSchemaWithoutRef)
        ? schemaDef
        : merger.mergeSchemas(schemaDef, resolvedSchemaWithoutRef),
      rootSchema,
      stack
    );
  }

  const properties = resolvedSchema[PROPERTIES_KEY];
  if (properties) {
    const resolvedProps = new Map<string, SchemaDefinition>();
    const stackCopies: Set<string>[] = [];
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === "boolean") {
        resolvedProps.set(key, value);
      } else {
        const stackCopy = new Set(stack);
        resolvedProps.set(
          key,
          resolveAllReferences(merger, value, rootSchema, stackCopy)
        );
        // TODO: Replace stack with an object with a Set of references
        // to use `union` Set method here
        stackCopies.push(stackCopy);
      }
    }
    const stackSize = stack.size;
    for (const copy of stackCopies) {
      if (copy.size === stackSize) {
        continue;
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      copy.forEach(stack.add, stack);
    }
    resolvedSchema = {
      ...resolvedSchema,
      [PROPERTIES_KEY]: Object.fromEntries(resolvedProps),
    };
  }

  const items = resolvedSchema[ITEMS_KEY];
  if (items && !Array.isArray(items) && typeof items !== "boolean") {
    resolvedSchema = {
      ...resolvedSchema,
      items: resolveAllReferences(merger, items, rootSchema, stack),
    };
  }
  return resolvedSchema;
}

export function resolveReference(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const resolvedSchema = resolveAllReferences(
    merger,
    schema,
    rootSchema,
    stack
  );
  if (!isSchemaDeepEqual(schema, resolvedSchema)) {
    return retrieveSchemaInternal(
      validator,
      merger,
      resolvedSchema,
      rootSchema,
      formData,
      expandAllBranches,
      stack
    );
  }
  return [schema];
}

/**
 * @private
 */
export function retrieveSchemaInternal(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  formData?: SchemaValue,
  expandAllBranches = false,
  stack = new Set<string>()
): Schema[] {
  const resolvedSchemas = resolveSchema(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
  return resolvedSchemas.flatMap((s): Schema | Schema[] => {
    let resolvedSchema = s;
    if (IF_KEY in resolvedSchema) {
      return resolveCondition(
        validator,
        merger,
        resolvedSchema,
        rootSchema,
        expandAllBranches,
        stack,
        formData
      );
    }
    const resolvedAllOf = resolvedSchema.allOf;
    if (resolvedAllOf) {
      // resolve allOf schemas
      if (expandAllBranches) {
        const { allOf: _, ...restOfSchema } = resolvedSchema;
        const schemas: Schema[] = [];
        for (let i = 0; i < resolvedAllOf.length; i++) {
          const schema = resolvedAllOf[i]!;
          if (typeof schema === "boolean") {
            continue;
          }
          schemas.push(schema);
        }
        schemas.push(restOfSchema);
        return schemas;
      }
      try {
        const withContainsSchemas: SchemaDefinition[] = [];
        const withoutContainsSchemas: SchemaDefinition[] = [];
        resolvedSchema.allOf?.forEach((s) => {
          if (isSchemaObject(s) && s.contains) {
            withContainsSchemas.push(s);
          } else {
            withoutContainsSchemas.push(s);
          }
        });
        if (withContainsSchemas.length) {
          resolvedSchema = { ...resolvedSchema, allOf: withoutContainsSchemas };
        }
        resolvedSchema = merger.mergeAllOf(resolvedSchema);
        if (withContainsSchemas.length) {
          resolvedSchema.allOf = withContainsSchemas;
        }
      } catch (e) {
        console.warn("could not merge subschemas in allOf:\n", e);
        const { allOf, ...resolvedSchemaWithoutAllOf } = resolvedSchema;
        return resolvedSchemaWithoutAllOf;
      }
    }
    const patternProperties = resolvedSchema.patternProperties;
    const hasPatternProperties = patternProperties !== undefined;
    const hasAdditionalProperties =
      resolvedSchema.additionalProperties !== undefined &&
      resolvedSchema.additionalProperties !== false;
    if (!hasPatternProperties && !hasAdditionalProperties) {
      return resolvedSchema;
    }
    const properties = { ...resolvedSchema.properties };
    const formDataIsSchemaObjectValue = isSchemaObjectValue(formData);
    if (hasPatternProperties) {
      for (const key of Object.keys(properties)) {
        const matchingProperties = getMatchingPatternProperties(
          patternProperties,
          key
        );
        if (matchingProperties.length > 0) {
          matchingProperties.push(properties[key]!);
          properties[key] = retrieveSchema(
            validator,
            merger,
            { allOf: matchingProperties },
            rootSchema,
            formDataIsSchemaObjectValue ? formData[key] : undefined
          );
        }
      }
    }
    return stubExistingAdditionalProperties(
      validator,
      merger,
      {
        ...resolvedSchema,
        properties,
      },
      rootSchema,
      formDataIsSchemaObjectValue ? formData : undefined
    );
  });
}

export function resolveCondition(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const {
    if: expression,
    then,
    else: otherwise,
    ...resolvedSchemaLessConditional
  } = schema;
  const conditionValue =
    expression !== undefined &&
    validator.isValid(expression, rootSchema, formData || {});
  let resolvedSchemas = [resolvedSchemaLessConditional];
  let schemas: Schema[] = [];
  if (expandAllBranches) {
    if (then && typeof then !== "boolean") {
      schemas = schemas.concat(
        retrieveSchemaInternal(
          validator,
          merger,
          then,
          rootSchema,
          formData,
          expandAllBranches,
          stack
        )
      );
    }
    if (otherwise && typeof otherwise !== "boolean") {
      schemas = schemas.concat(
        retrieveSchemaInternal(
          validator,
          merger,
          otherwise,
          rootSchema,
          formData,
          expandAllBranches,
          stack
        )
      );
    }
  } else {
    const conditionalSchema = conditionValue ? then : otherwise;
    if (conditionalSchema && typeof conditionalSchema !== "boolean") {
      schemas = schemas.concat(
        retrieveSchemaInternal(
          validator,
          merger,
          conditionalSchema,
          rootSchema,
          formData,
          expandAllBranches,
          stack
        )
      );
    }
  }
  if (schemas.length) {
    resolvedSchemas = isRecordEmpty(resolvedSchemaLessConditional)
      ? schemas
      : schemas.map((s) =>
          merger.mergeSchemas(resolvedSchemaLessConditional, s)
        );
  }
  return resolvedSchemas.flatMap((s) =>
    retrieveSchemaInternal(
      validator,
      merger,
      s,
      rootSchema,
      formData,
      expandAllBranches,
      stack
    )
  );
}

/**
 * WARN: This function will mutate `schema.properties` property
 */
export function stubExistingAdditionalProperties(
  validator: Validator,
  merger: Merger,
  schema: SchemaWithProperties,
  rootSchema: Schema,
  formData: SchemaObjectValue | undefined
): Schema {
  const { additionalProperties, patternProperties } = schema;
  const isAdditionalProperties =
    typeof additionalProperties !== "boolean" && additionalProperties;
  const isArbitraryAdditionalProperty =
    additionalProperties === true ||
    (isAdditionalProperties && Object.keys(additionalProperties).length === 0);

  function getAdditionalPropertySchemaShallowClone(key: string): Schema {
    if (patternProperties !== undefined) {
      const matchingProperties = getMatchingPatternProperties(
        patternProperties,
        key
      );
      if (matchingProperties.length > 0) {
        // TODO: Check if the shallow clone can be returned directly
        return {
          ...retrieveSchema(
            validator,
            merger,
            { allOf: matchingProperties },
            rootSchema,
            formData?.[key]
          ),
        };
      }
    }
    if (isAdditionalProperties) {
      if (REF_KEY in additionalProperties) {
        return {
          ...retrieveSchema(
            validator,
            merger,
            { $ref: additionalProperties[REF_KEY] },
            rootSchema,
            formData
          ),
        };
      }
      if ("type" in additionalProperties) {
        return { ...additionalProperties };
      }
      if (
        ANY_OF_KEY in additionalProperties ||
        ONE_OF_KEY in additionalProperties
      ) {
        return {
          type: "object",
          ...additionalProperties,
        };
      }
    }
    if (isArbitraryAdditionalProperty) {
      const value = formData?.[key];
      if (value !== undefined) {
        return { type: typeOfValue(value) };
      }
    }
    return { type: "null" };
  }

  if (formData !== undefined) {
    for (const key of Object.keys(formData)) {
      if (key in schema.properties) {
        // No need to stub, our schema already has the property
        continue;
      }
      const propertySchema = getAdditionalPropertySchemaShallowClone(key);
      // Set our additional property flag so we know it was dynamically added
      propertySchema[ADDITIONAL_PROPERTY_FLAG] = true;
      // The type of our new key should match the additionalProperties value;
      schema.properties[key] = propertySchema;
    }
  }
  return schema;
}

export function resolveSchema(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const updatedSchemas = resolveReference(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
  if (updatedSchemas.length > 1 || updatedSchemas[0] !== schema) {
    return updatedSchemas;
  }
  if (DEPENDENCIES_KEY in schema) {
    const resolvedSchemas = resolveDependencies(
      validator,
      merger,
      schema,
      rootSchema,
      expandAllBranches,
      stack,
      formData
    );
    return resolvedSchemas.flatMap((s) => {
      return retrieveSchemaInternal(
        validator,
        merger,
        s,
        rootSchema,
        formData,
        expandAllBranches,
        stack
      );
    });
  }
  if (ALL_OF_KEY in schema && Array.isArray(schema.allOf)) {
    const allOfSchemaElements = schema.allOf
      .filter((s): s is Schema => typeof s !== "boolean")
      .map((allOfSubSchema) =>
        retrieveSchemaInternal(
          validator,
          merger,
          allOfSubSchema,
          rootSchema,
          formData,
          expandAllBranches,
          stack
        )
      );
    const allPermutations = getAllPermutationsOfXxxOf(allOfSchemaElements);
    return allPermutations.map((permutation) => ({
      ...schema,
      allOf: permutation,
    }));
  }
  // No $ref or dependencies or allOf attribute was found, returning the original schema.
  return [schema];
}

export function resolveDependencies(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const { dependencies, ...remainingSchema } = schema;
  const resolvedSchemas = resolveAnyOrOneOfSchemas(
    validator,
    merger,
    remainingSchema,
    rootSchema,
    expandAllBranches,
    formData
  );
  return resolvedSchemas.flatMap((resolvedSchema) =>
    processDependencies(
      validator,
      merger,
      dependencies,
      resolvedSchema,
      rootSchema,
      expandAllBranches,
      stack,
      formData
    )
  );
}

export function resolveAnyOrOneOfSchemas(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  rawFormData?: SchemaValue
) {
  let anyOrOneOf: Schema[] | undefined;
  const { oneOf, anyOf, ...remaining } = schema;
  if (Array.isArray(oneOf)) {
    anyOrOneOf = oneOf as Schema[];
  } else if (Array.isArray(anyOf)) {
    anyOrOneOf = anyOf as Schema[];
  }
  if (anyOrOneOf) {
    // Ensure that during expand all branches we pass an object rather than undefined so that all options are interrogated
    const formData =
      rawFormData === undefined && expandAllBranches ? {} : rawFormData;
    const discriminator = getDiscriminatorFieldFromSchema(schema);
    anyOrOneOf = anyOrOneOf.map((s) => {
      // Due to anyOf/oneOf possibly using the same $ref we always pass a fresh recurse list array so that each option
      // can resolve recursive references independently
      return resolveAllReferences(merger, s, rootSchema);
    });
    // Call this to trigger the set of isValid() calls that the schema parser will need
    const option = getFirstMatchingOption(
      validator,
      formData,
      anyOrOneOf,
      rootSchema,
      discriminator
    );
    const isRemainingEmpty = isRecordEmpty(remaining);
    if (expandAllBranches) {
      return isRemainingEmpty
        ? anyOrOneOf
        : anyOrOneOf.map((item) => merger.mergeSchemas(remaining, item));
    }
    schema = isRemainingEmpty
      ? anyOrOneOf[option]!
      : merger.mergeSchemas(remaining, anyOrOneOf[option]!);
  }
  return [schema];
}

export function processDependencies(
  validator: Validator,
  merger: Merger,
  dependencies: Schema[typeof DEPENDENCIES_KEY],
  resolvedSchema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  let schemas = [resolvedSchema];
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (
      !expandAllBranches &&
      (!isSchemaObjectValue(formData) || formData[dependencyKey] === undefined)
    ) {
      continue;
    }
    // Skip this dependency if it is not included in the schema (such as when dependencyKey is itself a hidden dependency.)
    if (
      resolvedSchema.properties &&
      !(dependencyKey in resolvedSchema.properties)
    ) {
      continue;
    }
    const { [dependencyKey]: dependencyValue, ...remainingDependencies } =
      dependencies;
    if (Array.isArray(dependencyValue)) {
      schemas[0] = merger.mergeSchemas(resolvedSchema, {
        required: dependencyValue,
      });
    } else if (typeof dependencyValue !== "boolean" && dependencyValue) {
      schemas = withDependentSchema(
        validator,
        merger,
        resolvedSchema,
        rootSchema,
        dependencyKey,
        dependencyValue,
        expandAllBranches,
        stack,
        formData
      );
    }
    return schemas.flatMap((schema) =>
      processDependencies(
        validator,
        merger,
        remainingDependencies,
        schema,
        rootSchema,
        expandAllBranches,
        stack,
        formData
      )
    );
  }
  return schemas;
}

export function withDependentSchema(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  dependencyValue: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const dependentSchemas = retrieveSchemaInternal(
    validator,
    merger,
    dependencyValue,
    rootSchema,
    formData,
    expandAllBranches,
    stack
  );
  return dependentSchemas.flatMap((dependent) => {
    const { oneOf, ...dependentSchema } = dependent;
    const mergedSchema = isRecordEmpty(dependentSchema)
      ? schema
      : merger.mergeSchemas(schema, dependentSchema);
    // Since it does not contain oneOf, we return the original schema.
    if (oneOf === undefined) {
      return mergedSchema;
    }
    // Resolve $refs inside oneOf.
    const resolvedOneOfs = oneOf.map((subschema) => {
      if (typeof subschema === "boolean" || !(REF_KEY in subschema)) {
        return [subschema];
      }
      return resolveReference(
        validator,
        merger,
        subschema,
        rootSchema,
        expandAllBranches,
        stack,
        formData
      );
    });
    const allPermutations = getAllPermutationsOfXxxOf(resolvedOneOfs);
    return allPermutations.flatMap((resolvedOneOf) =>
      withExactlyOneSubSchema(
        validator,
        merger,
        mergedSchema,
        rootSchema,
        dependencyKey,
        resolvedOneOf,
        expandAllBranches,
        stack,
        formData
      )
    );
  });
}

export function withExactlyOneSubSchema(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  oneOf: Exclude<Schema["oneOf"], undefined>,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const validSubSchemas = oneOf.filter(
    (subschema): subschema is SchemaWithProperties => {
      if (
        typeof subschema === "boolean" ||
        !subschema ||
        !subschema.properties
      ) {
        return false;
      }
      const { [dependencyKey]: conditionPropertySchema } = subschema.properties;
      if (conditionPropertySchema) {
        const conditionSchema: Schema = {
          type: "object",
          properties: {
            [dependencyKey]: conditionPropertySchema,
          },
        };
        return (
          validator.isValid(conditionSchema, rootSchema, formData) ||
          expandAllBranches
        );
      }
      return false;
    }
  );

  if (!expandAllBranches && validSubSchemas.length !== 1) {
    console.warn(
      "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
    );
    return [schema];
  }
  return validSubSchemas.flatMap((s) => {
    const subschema = s;
    const { [dependencyKey]: _, ...dependentSubSchema } = subschema.properties;
    const dependentSchema = { ...subschema, properties: dependentSubSchema };
    const schemas = retrieveSchemaInternal(
      validator,
      merger,
      dependentSchema,
      rootSchema,
      formData,
      expandAllBranches,
      stack
    );
    return schemas.map((s) => merger.mergeSchemas(schema, s));
  });
}

export function getAllPermutationsOfXxxOf(listOfLists: SchemaDefinition[][]) {
  const allPermutations = listOfLists.reduce(
    (permutations, list) => {
      // When there are more than one set of schemas for a row, duplicate the set of permutations and add in the values
      if (list.length > 1) {
        return list.flatMap((element) =>
          array(permutations.length, (i) =>
            [...permutations[i]!].concat(element)
          )
        );
      }
      // Otherwise just push in the single value into the current set of permutations
      permutations.forEach((permutation) => permutation.push(list[0]!));
      return permutations;
    },
    [[]] as SchemaDefinition[][] // Start with an empty list
  );

  return allPermutations;
}

export function getMatchingPatternProperties(
  patternProperties: Exclude<Schema["patternProperties"], undefined>,
  key: string
) {
  const schemas: SchemaDefinition[] = [];
  for (const [p, d] of Object.entries(patternProperties)) {
    if (new RegExp(p).test(key)) {
      schemas.push(d);
    }
  }
  return schemas;
}
