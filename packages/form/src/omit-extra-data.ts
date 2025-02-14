import { isObject } from "@/lib/object.js";
import {
  getKnownProperties,
  resolveRef,
  getSimpleSchemaType,
  isSchema,
  isSchemaObjectValue,
  type Merger2,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
  type SchemaArrayValue,
  isSchemaArrayValue,
  isSelect,
  getClosestMatchingOption2,
  getDiscriminatorFieldFromSchema,
} from "@/core/index.js";

export function omitExtraData(
  validator: Validator,
  merger: Merger2,
  rootSchema: Schema,
  value: SchemaValue | undefined
): SchemaValue | undefined {
  function handleObject(
    schema: Schema,
    source: SchemaObjectValue,
    target: SchemaObjectValue
  ): SchemaObjectValue {
    const {
      properties,
      additionalProperties,
      patternProperties,
      propertyNames,
    } = schema;

    function setProperty(
      key: string,
      schemaDef: SchemaDefinition,
      value: SchemaValue | undefined
    ) {
      const v = omit(schemaDef, value, target[key]);
      if (v !== undefined) {
        target[key] = v;
      }
    }

    if (properties !== undefined) {
      for (const [key, schema] of Object.entries(properties)) {
        setProperty(key, schema, source[key]);
      }
    }
    if (additionalProperties !== undefined) {
      const knownProperties = new Set(getKnownProperties(schema, rootSchema));
      for (const [key, value] of Object.entries(source)) {
        if (knownProperties.has(key)) {
          continue;
        }
        setProperty(key, additionalProperties, value);
      }
    }
    if (patternProperties !== undefined) {
      const patterns = Object.entries(patternProperties).map(
        ([pattern, schemaDef]): [RegExp, SchemaDefinition] => [
          new RegExp(pattern),
          schemaDef,
        ]
      );
      for (const [key, value] of Object.entries(source)) {
        if (key in target) {
          continue;
        }
        const found = patterns.find((e) => e[0].test(key));
        if (found === undefined) {
          continue;
        }
        setProperty(key, found[1], value);
      }
    }
    if (propertyNames !== undefined) {
      for (const [key, value] of Object.entries(source)) {
        target[key] = value;
      }
    }
    return target;
  }

  function handleArray(
    schema: Schema,
    source: SchemaArrayValue,
    target: SchemaArrayValue
  ) {
    const { items, additionalItems } = schema;
    if (items !== undefined) {
      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          target.push(omit(items[i]!, source[i]));
        }
      } else {
        for (let i = 0; i < source.length; i++) {
          target.push(omit(items, source[i]));
        }
      }
    }
    if (additionalItems) {
      for (let i = target.length; i < source.length; i++) {
        target.push(omit(additionalItems, source[i]));
      }
    }
    return target;
  }

  function handleConditions(
    schema: Schema,
    source: SchemaValue | undefined,
    target: SchemaValue | undefined
  ) {
    const { if: condition, then, else: otherwise } = schema;
    if (condition === undefined) {
      return target;
    }
    const isThenBranch = isSchema(condition)
      ? validator.isValid(condition, rootSchema, source)
      : condition;
    const branch = isThenBranch ? then : otherwise;
    return branch === undefined ? target : omit(branch, source, target);
  }

  function handleOneOf(
    oneOf: Schema["oneOf"],
    schema: Schema,
    source: SchemaValue | undefined,
    target: SchemaValue | undefined
  ) {
    if (
      !Array.isArray(oneOf) ||
      isSelect(validator, merger, schema, rootSchema)
    ) {
      return target;
    }
    const bestIndex = getClosestMatchingOption2(
      validator,
      merger,
      rootSchema,
      source,
      oneOf.map((d) => (isSchema(d) ? d : d ? {} : { not: {} })),
      0,
      getDiscriminatorFieldFromSchema(schema)
    );
    return omit(oneOf[bestIndex]!, source, target);
  }

  function handleAllOf(
    allOf: Schema["allOf"],
    source: SchemaValue | undefined,
    target: SchemaValue | undefined
  ) {
    if (!Array.isArray(allOf)) {
      return target;
    }
    for (let i = 0; i < allOf.length; i++) {
      target = omit(allOf[i]!, source, target);
    }
    return target;
  }

  function handleAnyOf(
    schema: Schema,
    source: SchemaValue | undefined,
    target: SchemaValue | undefined
  ) {
    const { anyOf } = schema;
    if (!Array.isArray(anyOf)) {
      return target;
    }
    if (
      source === undefined ||
      (isObject(source) &&
        (Array.isArray(source)
          ? source.length === 0
          : Object.keys(source).length === 0))
    ) {
      return handleAllOf(anyOf, source, target);
    }
    return handleOneOf(anyOf, schema, source, target);
  }

  function handleDependencies(
    schema: Schema,
    source: SchemaValue | undefined,
    target: SchemaValue | undefined
  ) {
    const { dependencies } = schema;
    if (dependencies === undefined || !isSchemaObjectValue(source)) {
      return target;
    }
    for (const [key, deps] of Object.entries(dependencies)) {
      if (!(key in source) || Array.isArray(deps)) {
        continue;
      }
      target = omit(deps, source, target);
    }
    return target;
  }

  function omit(
    schema: SchemaDefinition,
    source: SchemaValue | undefined,
    target?: SchemaValue
  ): SchemaValue | undefined {
    if (source === undefined || !isSchema(schema)) {
      return source;
    }
    const { $ref: ref } = schema;
    if (ref !== undefined) {
      return omit(resolveRef(ref, rootSchema), source, target);
    }
    target = handleAnyOf(
      schema,
      source,
      handleAllOf(
        schema.allOf,
        source,
        handleOneOf(schema.oneOf, schema, source, target)
      )
    );
    const type = getSimpleSchemaType(schema);
    if (type === "object") {
      if (!isSchemaObjectValue(source)) {
        return undefined;
      }
      target = handleObject(
        schema,
        source,
        isSchemaObjectValue(target) ? target : {}
      );
    } else if (type === "array") {
      if (!isSchemaArrayValue(source)) {
        return undefined;
      }
      target = handleArray(
        schema,
        source,
        isSchemaArrayValue(target) ? target : []
      );
    } else if (target === undefined) {
      target = source;
    }

    return handleDependencies(
      schema,
      source,
      handleConditions(schema, source, target)
    );
  }

  return omit(rootSchema, value);
}
