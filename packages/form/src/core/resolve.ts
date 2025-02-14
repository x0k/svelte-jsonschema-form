// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/retrieveSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { array } from "@/lib/array.js";

import {
  ADDITIONAL_PROPERTIES_KEY,
  ADDITIONAL_PROPERTY_FLAG,
  ALL_OF_KEY,
  ANY_OF_KEY,
  DEPENDENCIES_KEY,
  IF_KEY,
  isSchema,
  ITEMS_KEY,
  ONE_OF_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
} from "./schema.js";
import { findSchemaDefinition } from "./definitions.js";
import type { Validator } from "./validator.js";
import { mergeSchemas } from "./merge.js";
import { typeOfValue } from "./type.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { getFirstMatchingOption } from "./matching.js";
import { isSchemaObjectValue } from "./value.js";
import { defaultMerger, type Merger } from "./merger.js";
import { isSchemaDeepEqual } from './deep-equal.js';

/**
 * @deprecated use `retrieveSchema2`
 */
export function retrieveSchema(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema = {},
  formData?: SchemaValue,
  merger: Merger = defaultMerger
): Schema {
  return retrieveSchema2(validator, merger, schema, rootSchema, formData);
}

export function retrieveSchema2(
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
    return resolveAllReferences(
      mergeSchemas(
        findSchemaDefinition(ref, rootSchema),
        resolvedSchemaWithoutRef
      ),
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
          resolveAllReferences(value, rootSchema, stackCopy)
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
      items: resolveAllReferences(items, rootSchema, stack),
    };
  }
  return resolvedSchema;
}

/**
 * @deprecated use `resolveReference2`
 */
export function resolveReference(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return resolveReference2(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
}

export function resolveReference2(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const resolvedSchema = resolveAllReferences(schema, rootSchema, stack);
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
  const resolvedSchemas = resolveSchema2(
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
      return resolveCondition2(
        validator,
        merger,
        resolvedSchema,
        rootSchema,
        expandAllBranches,
        stack,
        formData
      );
    }
    const resolvedAllOf = resolvedSchema[ALL_OF_KEY];
    if (resolvedAllOf) {
      // resolve allOf schemas
      if (expandAllBranches) {
        const { [ALL_OF_KEY]: _, ...restOfSchema } = resolvedSchema;
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
          if (isSchema(s) && s.contains) {
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
    const hasAdditionalProperties =
      ADDITIONAL_PROPERTIES_KEY in resolvedSchema &&
      resolvedSchema.additionalProperties !== false;
    if (hasAdditionalProperties) {
      return stubExistingAdditionalProperties2(
        validator,
        merger,
        resolvedSchema,
        rootSchema,
        formData
      );
    }

    return resolvedSchema;
  });
}

/**
 * @deprecated use `resolveCondition2`
 */
export function resolveCondition(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return resolveCondition2(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
}

export function resolveCondition2(
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
    resolvedSchemas = schemas.map((s) =>
      mergeSchemas(resolvedSchemaLessConditional, s)
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
 * @deprecated use `stubExistingAdditionalProperties2`
 */
export function stubExistingAdditionalProperties(
  validator: Validator,
  theSchema: Schema,
  rootSchema?: Schema,
  aFormData?: SchemaValue,
  merger = defaultMerger
): Schema {
  return stubExistingAdditionalProperties2(
    validator,
    merger,
    theSchema,
    rootSchema,
    aFormData
  );
}

export function stubExistingAdditionalProperties2(
  validator: Validator,
  merger: Merger,
  theSchema: Schema,
  rootSchema?: Schema,
  aFormData?: SchemaValue
): Schema {
  // Clone the schema so that we don't ruin the consumer's original
  const schema = {
    ...theSchema,
    properties: { ...theSchema.properties },
  };

  // make sure formData is an object
  const formData: SchemaObjectValue = isSchemaObjectValue(aFormData)
    ? aFormData
    : {};
  Object.keys(formData).forEach((key) => {
    if (key in schema.properties) {
      // No need to stub, our schema already has the property
      return;
    }

    let additionalProperties: Schema["additionalProperties"] = {};
    const schemaAdditionalProperties = schema.additionalProperties;
    if (
      typeof schemaAdditionalProperties !== "boolean" &&
      schemaAdditionalProperties
    ) {
      if (REF_KEY in schemaAdditionalProperties) {
        additionalProperties = retrieveSchema2(
          validator,
          merger,
          { $ref: schemaAdditionalProperties[REF_KEY] },
          rootSchema,
          formData
        );
      } else if ("type" in schemaAdditionalProperties) {
        additionalProperties = { ...schemaAdditionalProperties };
      } else if (
        ANY_OF_KEY in schemaAdditionalProperties ||
        ONE_OF_KEY in schemaAdditionalProperties
      ) {
        additionalProperties = {
          type: "object",
          ...schemaAdditionalProperties,
        };
      } else {
        const value = formData[key];
        if (value !== undefined) {
          additionalProperties = { type: typeOfValue(value) };
        }
      }
    } else {
      const value = formData[key];
      if (value !== undefined) {
        additionalProperties = { type: typeOfValue(value) };
      }
    }

    // The type of our new key should match the additionalProperties value;
    schema.properties[key] = {
      ...additionalProperties,
      // Set our additional property flag so we know it was dynamically added
      // @ts-expect-error TODO: Remove this hack
      [ADDITIONAL_PROPERTY_FLAG]: true,
    };
  });
  return schema;
}

/**
 * @deprecated use `resolveSchema2`
 */
export function resolveSchema(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return resolveSchema2(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
}

export function resolveSchema2(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue
): Schema[] {
  const updatedSchemas = resolveReference2(
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
    const resolvedSchemas = resolveDependencies2(
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

/**
 * @deprecated use `resolveDependencies2`
 */
export function resolveDependencies(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return resolveDependencies2(
    validator,
    merger,
    schema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
}

export function resolveDependencies2(
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
    remainingSchema,
    rootSchema,
    expandAllBranches,
    formData
  );
  return resolvedSchemas.flatMap((resolvedSchema) =>
    processDependencies2(
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
      return resolveAllReferences(s, rootSchema);
    });
    // Call this to trigger the set of isValid() calls that the schema parser will need
    const option = getFirstMatchingOption(
      validator,
      formData,
      anyOrOneOf,
      rootSchema,
      discriminator
    );
    if (expandAllBranches) {
      return anyOrOneOf.map((item) => mergeSchemas(remaining, item));
    }
    schema = mergeSchemas(remaining, anyOrOneOf[option]!);
  }
  return [schema];
}

/**
 * @deprecated use `processDependencies2`
 */
export function processDependencies(
  validator: Validator,
  dependencies: Schema[typeof DEPENDENCIES_KEY],
  resolvedSchema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return processDependencies2(
    validator,
    merger,
    dependencies,
    resolvedSchema,
    rootSchema,
    expandAllBranches,
    stack,
    formData
  );
}

export function processDependencies2(
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
      schemas[0] = mergeSchemas(resolvedSchema, { required: dependencyValue });
    } else if (typeof dependencyValue !== "boolean" && dependencyValue) {
      schemas = withDependentSchema2(
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
      processDependencies2(
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

/**
 * @deprecated use `withDependentSchema2`
 */
export function withDependentSchema(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  dependencyValue: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return withDependentSchema2(
    validator,
    merger,
    schema,
    rootSchema,
    dependencyKey,
    dependencyValue,
    expandAllBranches,
    stack,
    formData
  );
}

export function withDependentSchema2(
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
    const mergedSchema = mergeSchemas(schema, dependentSchema);
    // Since it does not contain oneOf, we return the original schema.
    if (oneOf === undefined) {
      return mergedSchema;
    }
    // Resolve $refs inside oneOf.
    const resolvedOneOfs = oneOf.map((subschema) => {
      if (typeof subschema === "boolean" || !(REF_KEY in subschema)) {
        return [subschema];
      }
      return resolveReference2(
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
      withExactlyOneSubSchema2(
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

type SchemaWithProperties = Schema & {
  properties: Exclude<Schema["properties"], undefined>;
};

/**
 * @deprecated use `withExactlyOneSubSchema2`
 */
export function withExactlyOneSubSchema(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  oneOf: Exclude<Schema["oneOf"], undefined>,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: SchemaValue,
  merger = defaultMerger
): Schema[] {
  return withExactlyOneSubSchema2(
    validator,
    merger,
    schema,
    rootSchema,
    dependencyKey,
    oneOf,
    expandAllBranches,
    stack,
    formData
  );
}

export function withExactlyOneSubSchema2(
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
  const validSubSchemas = oneOf!.filter(
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

  if (!expandAllBranches && validSubSchemas!.length !== 1) {
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
    return schemas.map((s) => mergeSchemas(schema, s));
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
