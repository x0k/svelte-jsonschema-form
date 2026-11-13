// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/retrieveSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { array } from "#lib/array.js";
import { isJsonSchemaType } from "#lib/json-schema/index.js";
import { getOwn, isRecordEmpty, setOwn } from "#lib/object.js";

import {
  isValid,
  mergeAllOf,
  mergeSchemas,
  type CoreContext,
} from "./context.js";
import { isSchemaDeepEqual } from "./deep-equal.js";
import { findSchemaDefinition } from "./definitions.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { getFirstMatchingOption } from "./matching.js";
import {
  ADDITIONAL_PROPERTY_FLAG,
  ALL_OF_KEY,
  ANY_OF_KEY,
  DEPENDENCIES_KEY,
  IF_KEY,
  ITEMS_KEY,
  ONE_OF_KEY,
  PROPERTIES_KEY,
  REF_FLAG,
  REF_KEY,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type SchemaWithProperties,
} from "./schema.js";
import { typeOfValue } from "./type.js";
import { isSchemaObjectValue } from "./value.js";

// Backstop for the `resolveReference` <-> `retrieveSchemaInternal` loop: with
// the path reconstructed from `REF_FLAG` markers a pass over an already-resolved
// schema is a no-op, so a resolution that still changes after this many passes
// over a single schema is not terminating; it collapses to the schema resolved
// so far instead of overflowing the stack. The count is local to one fixpoint
// loop: nested allOf, then/else and dependencies branches receive only the
// caller's re-walk status, so nesting depth alone cannot reach this limit.
const MAX_RESOLUTION_PASSES = 100;

// WARN: Any change to this function must be synchronized with `validators/precompile`
export function createConditionSchema(
  dependencyKey: string,
  propertySchema: SchemaDefinition
): Schema {
  return {
    type: "object",
    properties: {
      [dependencyKey]: propertySchema,
    },
  };
}

export function retrieveSchema(
  ctx: CoreContext,
  schema: Schema,
  formData?: SchemaValue,
  resolveAnyOfOrOneOfRefs = false
): Schema {
  return retrieveSchemaInternal(
    ctx,
    schema,
    formData,
    undefined,
    resolveAnyOfOrOneOfRefs
  )[0]!;
}

export function resolveAllReferences(
  ctx: CoreContext,
  schema: Schema,
  stack = new Set<string>(),
  resolveAnyOfOrOneOfRefs?: boolean,
  expandedRefs?: string[],
  passCount = 0
): Schema {
  let resolvedSchema: Schema = schema;
  let path = stack;
  const ref = resolvedSchema[REF_KEY];
  if (ref) {
    if (path.has(ref) || (passCount > 0 && resolvedSchema[REF_FLAG] === ref)) {
      return resolvedSchema;
    }
    path = new Set(path);
    path.add(ref);
    expandedRefs?.push(ref);
    const { [REF_KEY]: _, ...resolvedSchemaWithoutRef } = resolvedSchema;
    const schemaDef = findSchemaDefinition(ctx, ref);
    return {
      ...resolveAllReferences(
        ctx,
        isRecordEmpty(resolvedSchemaWithoutRef)
          ? schemaDef
          : mergeSchemas(ctx, schemaDef, resolvedSchemaWithoutRef),
        path,
        resolveAnyOfOrOneOfRefs,
        expandedRefs,
        passCount
      ),
      [REF_FLAG]: ref,
    };
  }
  if (passCount > 0) {
    const sourceRef = resolvedSchema[REF_FLAG];
    if (sourceRef !== undefined) {
      if (!path.has(sourceRef)) {
        path = new Set(path);
        path.add(sourceRef);
      }
      if (expandedRefs !== undefined && !expandedRefs.includes(sourceRef)) {
        expandedRefs.push(sourceRef);
      }
    }
  }

  const properties = resolvedSchema[PROPERTIES_KEY];
  if (properties) {
    const resolvedProps = new Map<string, SchemaDefinition>();
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === "boolean") {
        resolvedProps.set(key, value);
      } else {
        resolvedProps.set(
          key,
          resolveAllReferences(
            ctx,
            value,
            path,
            resolveAnyOfOrOneOfRefs,
            expandedRefs,
            passCount
          )
        );
      }
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
      items: resolveAllReferences(
        ctx,
        items,
        path,
        resolveAnyOfOrOneOfRefs,
        expandedRefs,
        passCount
      ),
    };
  }
  if (resolveAnyOfOrOneOfRefs) {
    let key: "anyOf" | "oneOf" | undefined;
    let schemas: SchemaDefinition[] | undefined;
    if (ANY_OF_KEY in schema && Array.isArray(schema[ANY_OF_KEY])) {
      key = ANY_OF_KEY;
      schemas = resolvedSchema[ANY_OF_KEY];
    } else if (ONE_OF_KEY in schema && Array.isArray(schema[ONE_OF_KEY])) {
      key = ONE_OF_KEY;
      schemas = resolvedSchema[ONE_OF_KEY];
    }
    if (key && schemas) {
      let optionsPath = path;
      resolvedSchema = {
        ...resolvedSchema,
        [key]: schemas.map((s) => {
          if (typeof s === "boolean") {
            return s;
          }
          const expandedBefore = expandedRefs?.length ?? 0;
          const option = resolveAllReferences(
            ctx,
            s,
            optionsPath,
            resolveAnyOfOrOneOfRefs,
            expandedRefs,
            passCount
          );
          if (
            expandedRefs !== undefined &&
            expandedRefs.length > expandedBefore
          ) {
            optionsPath = new Set(optionsPath);
            for (const expandedRef of expandedRefs.slice(expandedBefore)) {
              optionsPath.add(expandedRef);
            }
          }
          return option;
        }),
      };
    }
  }
  return resolvedSchema;
}

function enclosingRefPath(
  schema: Schema,
  stack: Set<string>,
  passCount: number
): Set<string> {
  if (passCount === 0) {
    return stack;
  }
  const sourceRef = schema[REF_FLAG];
  if (sourceRef === undefined || stack.has(sourceRef)) {
    return stack;
  }
  const path = new Set(stack);
  path.add(sourceRef);
  return path;
}

export function resolveReference(
  ctx: CoreContext,
  schema: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  resolveAnyOfOrOneOfRefs?: boolean,
  preserveDependencies = false,
  passCount = 0
): Schema[] {
  if (passCount > MAX_RESOLUTION_PASSES) {
    // Backstop: collapse to the schema resolved so far instead of overflowing
    // the stack. Cycles themselves are detected on the render path from
    // `REF_FLAG`, so the collapsed schema needs no extra marker.
    return [schema];
  }
  const expandedRefs: string[] = [];
  const resolvedSchema = resolveAllReferences(
    ctx,
    schema,
    stack,
    resolveAnyOfOrOneOfRefs,
    expandedRefs,
    passCount
  );
  if (!isSchemaDeepEqual(schema, resolvedSchema)) {
    return retrieveSchemaInternal(
      ctx,
      resolvedSchema,
      formData,
      stack,
      resolveAnyOfOrOneOfRefs,
      preserveDependencies,
      passCount + 1
    );
  }
  return [schema];
}

/**
 * @private
 */
export function retrieveSchemaInternal(
  ctx: CoreContext,
  schema: Schema,
  formData?: SchemaValue,
  stack = new Set<string>(),
  resolveAnyOfOrOneOfRefs?: boolean,
  preserveDependencies = false,
  passCount = 0
): Schema[] {
  const resolvedSchemas = resolveSchema(
    ctx,
    schema,
    stack,
    formData,
    resolveAnyOfOrOneOfRefs,
    preserveDependencies,
    passCount
  );
  return resolvedSchemas.flatMap((s): Schema | Schema[] => {
    let resolvedSchema = s;
    if (IF_KEY in resolvedSchema) {
      return resolveCondition(
        ctx,
        resolvedSchema,
        stack,
        formData,
        preserveDependencies,
        passCount
      );
    }
    const resolvedAllOf = resolvedSchema.allOf;
    if (resolvedAllOf) {
      // resolve allOf schemas
      try {
        // CHANGED: No need for `contains` workaround this with modern merger
        resolvedSchema = mergeAllOf(ctx, resolvedSchema);
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
          setOwn(
            properties,
            key,
            retrieveSchemaInternal(
              ctx,
              { allOf: matchingProperties },
              formDataIsSchemaObjectValue ? formData[key] : undefined,
              undefined,
              undefined,
              preserveDependencies
            )[0]!
          );
        }
      }
    }
    return stubExistingAdditionalProperties(
      ctx,
      {
        ...resolvedSchema,
        properties,
      },
      formDataIsSchemaObjectValue ? formData : undefined
    );
  });
}

export function resolveCondition(
  ctx: CoreContext,
  schema: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  preserveDependencies = false,
  passCount = 0
): Schema[] {
  const {
    if: expression,
    then,
    else: otherwise,
    ...resolvedSchemaLessConditional
  } = schema;
  // `null` is checked as `{}` like `undefined`: object keywords such as `required`
  // ignore non-objects, so a `null` would satisfy `if: { required: ["a"] }` and
  // take `then` for an object with no data.
  const conditionValue =
    expression !== undefined && isValid(ctx, expression, formData ?? {});
  let resolvedSchemas = [resolvedSchemaLessConditional];
  let schemas: Schema[] = [];
  const conditionalSchema = conditionValue ? then : otherwise;
  if (conditionalSchema !== undefined) {
    schemas = schemas.concat(
      retrieveSchemaInternal(
        ctx,
        normalizeBooleanSchema(conditionalSchema),
        formData,
        enclosingRefPath(schema, stack, passCount),
        undefined,
        preserveDependencies,
        passCount > 0 ? 1 : 0
      )
    );
  }
  if (schemas.length) {
    resolvedSchemas = isRecordEmpty(resolvedSchemaLessConditional)
      ? schemas
      : schemas.map((s) => mergeSchemas(ctx, resolvedSchemaLessConditional, s));
  }
  return resolvedSchemas.flatMap((s) =>
    retrieveSchemaInternal(
      ctx,
      s,
      formData,
      stack,
      undefined,
      preserveDependencies,
      passCount + 1
    )
  );
}

/**
 * WARN: This function will mutate `schema.properties` property
 */
export function stubExistingAdditionalProperties(
  ctx: CoreContext,
  schema: SchemaWithProperties,
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
            ctx,
            { allOf: matchingProperties },
            formData?.[key]
          ),
        };
      }
    }
    if (isAdditionalProperties) {
      if (REF_KEY in additionalProperties) {
        return {
          ...retrieveSchema(
            ctx,
            { $ref: additionalProperties[REF_KEY] },
            formData?.[key]
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
        const type = typeOfValue(value);
        return isJsonSchemaType(type) ? { type } : {};
      }
    }
    return { type: "null" };
  }

  if (formData !== undefined) {
    for (const key of Object.keys(formData)) {
      if (Object.hasOwn(schema.properties, key)) {
        // No need to stub, our schema already has the property
        continue;
      }
      const propertySchema = getAdditionalPropertySchemaShallowClone(key);
      // Set our additional property flag so we know it was dynamically added
      propertySchema[ADDITIONAL_PROPERTY_FLAG] = true;
      // The type of our new key should match the additionalProperties value;
      setOwn(schema.properties, key, propertySchema);
    }
  }
  return schema;
}

export function resolveSchema(
  ctx: CoreContext,
  schema: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  resolveAnyOfOrOneOfRefs?: boolean,
  preserveDependencies = false,
  passCount = 0
): Schema[] {
  const updatedSchemas = resolveReference(
    ctx,
    schema,
    stack,
    formData,
    resolveAnyOfOrOneOfRefs,
    preserveDependencies,
    passCount
  );
  if (updatedSchemas.length > 1 || updatedSchemas[0] !== schema) {
    return updatedSchemas;
  }
  if (DEPENDENCIES_KEY in schema && !preserveDependencies) {
    const resolvedSchemas = resolveDependencies(
      ctx,
      schema,
      stack,
      formData,
      passCount
    );
    return resolvedSchemas.flatMap((s) => {
      return retrieveSchemaInternal(
        ctx,
        s,
        formData,
        stack,
        undefined,
        preserveDependencies,
        passCount + 1
      );
    });
  }
  if (ALL_OF_KEY in schema && Array.isArray(schema.allOf)) {
    const allOfSchemaElements = schema.allOf
      .filter((s): s is Schema => typeof s !== "boolean")
      .map((allOfSubSchema) =>
        retrieveSchemaInternal(
          ctx,
          allOfSubSchema,
          formData,
          enclosingRefPath(schema, stack, passCount),
          undefined,
          preserveDependencies,
          passCount > 0 ? 1 : 0
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
  ctx: CoreContext,
  schema: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  passCount = 0
): Schema[] {
  const { dependencies, ...remainingSchema } = schema;
  const resolvedSchemas = resolveAnyOrOneOfSchemas(
    ctx,
    remainingSchema,
    formData
  );
  return resolvedSchemas.flatMap((resolvedSchema) =>
    processDependencies(
      ctx,
      dependencies,
      resolvedSchema,
      stack,
      formData,
      passCount
    )
  );
}

export function resolveAnyOrOneOfSchemas(
  ctx: CoreContext,
  schema: Schema,
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
    const formData = rawFormData;
    const discriminator = getDiscriminatorFieldFromSchema(schema);
    anyOrOneOf = anyOrOneOf.map((s) => {
      // Due to anyOf/oneOf possibly using the same $ref we always pass a fresh recurse list array so that each option
      // can resolve recursive references independently
      return resolveAllReferences(ctx, s);
    });
    // Call this to trigger the set of isValid() calls that the schema parser will need
    const option = getFirstMatchingOption(
      ctx,
      formData,
      anyOrOneOf,
      discriminator
    );
    const isRemainingEmpty = isRecordEmpty(remaining);
    schema = isRemainingEmpty
      ? anyOrOneOf[option]!
      : mergeSchemas(ctx, remaining, anyOrOneOf[option]!);
  }
  return [schema];
}

export function processDependencies(
  ctx: CoreContext,
  dependencies: Schema[typeof DEPENDENCIES_KEY],
  resolvedSchema: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  passCount = 0
): Schema[] {
  let schemas = [resolvedSchema];
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (
      !isSchemaObjectValue(formData) ||
      getOwn(formData, dependencyKey) === undefined
    ) {
      continue;
    }
    // Skip this dependency if it is not included in the schema (such as when dependencyKey is itself a hidden dependency.)
    if (
      resolvedSchema.properties &&
      !Object.hasOwn(resolvedSchema.properties, dependencyKey)
    ) {
      continue;
    }
    const { [dependencyKey]: dependencyValue, ...remainingDependencies } =
      dependencies;
    if (Array.isArray(dependencyValue)) {
      schemas[0] = mergeSchemas(ctx, resolvedSchema, {
        required: dependencyValue,
      });
    } else if (typeof dependencyValue !== "boolean" && dependencyValue) {
      schemas = withDependentSchema(
        ctx,
        resolvedSchema,
        dependencyKey,
        dependencyValue,
        stack,
        formData,
        passCount
      );
    }
    return schemas.flatMap((schema) =>
      processDependencies(
        ctx,
        remainingDependencies,
        schema,
        stack,
        formData,
        passCount
      )
    );
  }
  return schemas;
}

export function withDependentSchema(
  ctx: CoreContext,
  schema: Schema,
  dependencyKey: string,
  dependencyValue: Schema,
  stack: Set<string>,
  formData?: SchemaValue,
  passCount = 0
): Schema[] {
  const dependentSchemas = retrieveSchemaInternal(
    ctx,
    dependencyValue,
    formData,
    enclosingRefPath(schema, stack, passCount),
    undefined,
    undefined,
    passCount > 0 ? 1 : 0
  );
  return dependentSchemas.flatMap((dependent) => {
    const { oneOf, ...dependentSchema } = dependent;
    const mergedSchema = isRecordEmpty(dependentSchema)
      ? schema
      : mergeSchemas(ctx, schema, dependentSchema);
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
        ctx,
        subschema,
        enclosingRefPath(schema, stack, passCount),
        formData,
        undefined,
        undefined,
        passCount > 0 ? 1 : 0
      );
    });
    const allPermutations = getAllPermutationsOfXxxOf(resolvedOneOfs);
    return allPermutations.flatMap((resolvedOneOf) =>
      withExactlyOneSubSchema(
        ctx,
        mergedSchema,
        dependencyKey,
        resolvedOneOf,
        stack,
        formData,
        passCount
      )
    );
  });
}

export function withExactlyOneSubSchema(
  ctx: CoreContext,
  schema: Schema,
  dependencyKey: string,
  oneOf: Exclude<Schema["oneOf"], undefined>,
  stack: Set<string>,
  formData?: SchemaValue,
  passCount = 0
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
        return isValid(
          ctx,
          createConditionSchema(dependencyKey, conditionPropertySchema),
          formData
        );
      }
      return false;
    }
  );

  if (validSubSchemas.length !== 1) {
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
      ctx,
      dependentSchema,
      formData,
      enclosingRefPath(schema, stack, passCount),
      undefined,
      undefined,
      passCount > 0 ? 1 : 0
    );
    return schemas.map((s) => mergeSchemas(ctx, schema, s));
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

function normalizeBooleanSchema(schema: SchemaDefinition): Schema {
  if (typeof schema !== "boolean") {
    return schema;
  }
  return schema ? {} : { not: {} };
}
