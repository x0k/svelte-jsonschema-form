import { deepEqual } from "fast-equals";
import mergeAllOf, { type Options } from "json-schema-merge-allof";

import { array } from "@/lib/array";

import {
  ADDITIONAL_PROPERTIES_KEY,
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
} from "./schema";
import { findSchemaDefinition } from "./definitions";
import type { Validator } from "./validator";
import { mergeSchemas } from "./merge";
import { typeOfValue } from "./type";
import { getDiscriminatorFieldFromSchema } from "./discriminator";
import { getFirstMatchingOption } from "./matching";
import { isSchemaObjectValue } from "./value";

export function retrieveSchema<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema = {},
  formData?: T
): Schema {
  return retrieveSchemaInternal(validator, schema, rootSchema, formData)[0];
}

export function resolveAllReferences(
  schema: Schema,
  rootSchema: Schema,
  stack = new Set<string>()
): Schema {
  if (typeof schema !== "object") {
    return schema;
  }

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
        stackCopy.forEach(stack.add, stack);
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
      items: resolveAllReferences(items, rootSchema, stack),
    };
  }
  return resolvedSchema;
}

export function resolveReference<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  const resolvedSchema = resolveAllReferences(schema, rootSchema, stack);
  if (!deepEqual(schema, resolvedSchema)) {
    return retrieveSchemaInternal(
      validator,
      resolvedSchema,
      rootSchema,
      formData,
      expandAllBranches,
      stack
    );
  }
  return [schema];
}

export function retrieveSchemaInternal<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  formData?: T,
  expandAllBranches = false,
  stack = new Set<string>()
): Schema[] {
  const resolvedSchemas = resolveSchema(
    validator,
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
          const schema = resolvedAllOf[i];
          if (typeof schema === "boolean") {
            continue;
          }
          schemas.push(schema);
        }
        schemas.push(restOfSchema);
        return schemas;
      }
      try {
        resolvedSchema = mergeAllOf(resolvedSchema, {
          deep: false,
        } as Options) as Schema;
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
      return stubExistingAdditionalProperties(
        validator,
        resolvedSchema,
        rootSchema,
        formData as T
      );
    }

    return resolvedSchema;
  });
}

export function resolveCondition<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  const {
    if: expression,
    then,
    else: otherwise,
    ...resolvedSchemaLessConditional
  } = schema;
  const conditionValue =
    expression !== undefined &&
    validator.isValid(expression, rootSchema, formData || ({} as T));
  let resolvedSchemas = [resolvedSchemaLessConditional];
  let schemas: Schema[] = [];
  if (expandAllBranches) {
    if (then && typeof then !== "boolean") {
      schemas = schemas.concat(
        retrieveSchemaInternal(
          validator,
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
      s,
      rootSchema,
      formData,
      expandAllBranches,
      stack
    )
  );
}

export function stubExistingAdditionalProperties<T extends SchemaValue>(
  validator: Validator<T>,
  theSchema: Schema,
  rootSchema?: Schema,
  aFormData?: T
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
        additionalProperties = retrieveSchema(
          validator,
          { $ref: schemaAdditionalProperties[REF_KEY] },
          rootSchema,
          formData as T
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
          additionalProperties = { type: typeOfValue(value) }
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

export function resolveSchema<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  const updatedSchemas = resolveReference(
    validator,
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
      schema,
      rootSchema,
      expandAllBranches,
      stack,
      formData
    );
    return resolvedSchemas.flatMap((s) => {
      return retrieveSchemaInternal(
        validator,
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

export function resolveDependencies<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  const { [DEPENDENCIES_KEY]: dependencies, ...remainingSchema } = schema;
  const resolvedSchemas = resolveAnyOrOneOfSchemas(
    validator,
    remainingSchema,
    rootSchema,
    expandAllBranches,
    formData
  );
  return resolvedSchemas.flatMap((resolvedSchema) =>
    processDependencies(
      validator,
      dependencies,
      resolvedSchema,
      rootSchema,
      expandAllBranches,
      stack,
      formData
    )
  );
}

export function resolveAnyOrOneOfSchemas<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  rawFormData?: T
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
      rawFormData === undefined && expandAllBranches ? ({} as T) : rawFormData;
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
    schema = mergeSchemas(remaining, anyOrOneOf[option]);
  }
  return [schema];
}

export function processDependencies<T extends SchemaValue>(
  validator: Validator<T>,
  dependencies: Schema[typeof DEPENDENCIES_KEY],
  resolvedSchema: Schema,
  rootSchema: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  let schemas = [resolvedSchema];
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (
      !expandAllBranches &&
      isSchemaObjectValue(formData) &&
      formData[dependencyKey] === undefined
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
    } else if (typeof dependencyValue !== "boolean") {
      schemas = withDependentSchema(
        validator,
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

export function withDependentSchema<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  dependencyValue: Schema,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
): Schema[] {
  const dependentSchemas = retrieveSchemaInternal(
    validator,
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
      return resolveReference(
        validator,
        subschema,
        rootSchema,
        expandAllBranches,
        stack,
        formData
      );
    });
    const allPermutations = getAllPermutationsOfXxxOf(resolvedOneOfs);
    return allPermutations.flatMap((resolvedOneOf) =>
      withExactlyOneSubSchema<T>(
        validator,
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

export function withExactlyOneSubSchema<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema: Schema,
  dependencyKey: string,
  oneOf: Exclude<Schema["oneOf"], undefined>,
  expandAllBranches: boolean,
  stack: Set<string>,
  formData?: T
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
            [...permutations[i]].concat(element)
          )
        );
      }
      // Otherwise just push in the single value into the current set of permutations
      permutations.forEach((permutation) => permutation.push(list[0]));
      return permutations;
    },
    [[]] as SchemaDefinition[][] // Start with an empty list
  );

  return allPermutations;
}
