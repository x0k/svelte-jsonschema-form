import {
  resolveRef,
  getSimpleSchemaType,
  isSchemaObjectValue,
  type Merger,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
  type SchemaArrayValue,
  isSchemaArrayValue,
  isSelect,
  getClosestMatchingOption,
  getDiscriminatorFieldFromSchema,
} from "@/core/index.js";
import { isSchemaObject } from "@/lib/json-schema/index.js";
import { isObject, isRecordEmpty } from "@/lib/object.js";

// WARN: Any change to this function must be synchronized with `validators/precompile`
export function allowAdditionalProperties(s: Schema): Schema {
  return { ...s, additionalProperties: true };
}

function computeObjectSchema({
  properties,
  patternProperties,
  additionalProperties,
}: Schema) {
  const localProperties = new Set(properties && Object.keys(properties));
  const patterns = patternProperties
    ? Object.entries(patternProperties).map(
        ([pattern, schemaDef]): [RegExp, SchemaDefinition] => [
          new RegExp(pattern),
          schemaDef,
        ]
      )
    : undefined;
  return {
    properties,
    localProperties,
    patterns,
    additionalProperties,
  };
}

type ObjectSchema = ReturnType<typeof computeObjectSchema>;

export function omitExtraData(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  value: SchemaValue | undefined
): SchemaValue | undefined {
  function handleObject(
    schema: ObjectSchema,
    source: SchemaObjectValue,
    target: SchemaObjectValue
  ): SchemaObjectValue {
    const {
      properties,
      localProperties,
      patterns,
      additionalProperties = false,
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
    let patternPropertiesRest: string[] | undefined;
    if (patterns !== undefined) {
      patternPropertiesRest = [];
      for (const [key, value] of Object.entries(source)) {
        if (localProperties.has(key)) {
          continue;
        }
        const found = patterns.find((e) => e[0].test(key));
        if (found === undefined) {
          patternPropertiesRest.push(key);
          continue;
        }
        setProperty(key, found[1], value);
      }
    }
    if (additionalProperties !== false) {
      if (patternPropertiesRest !== undefined) {
        for (const key of patternPropertiesRest) {
          setProperty(key, additionalProperties, source[key]);
        }
      } else {
        for (const [key, value] of Object.entries(source)) {
          if (
            localProperties.has(key) ||
            patterns?.some(([pattern]) => pattern.test(key))
          ) {
            continue;
          }
          setProperty(key, additionalProperties, value);
        }
      }
    }
    return target;
  }

  function handleArray(
    schema: Schema,
    source: SchemaArrayValue,
    target: SchemaArrayValue
  ) {
    const { items, additionalItems = false } = schema;
    if (items === undefined) {
      return target;
    }
    if (Array.isArray(items)) {
      const tupleLength = Math.min(items.length, source.length);
      let i = 0;
      for (; i < tupleLength; i++) {
        target[i] = omit(items[i]!, source[i]);
      }
      if (additionalItems === false) {
        target.length = tupleLength;
        return target;
      }
      for (; i < source.length; i++) {
        target[i] = omit(additionalItems, source[i]);
      }
    } else {
      for (let i = 0; i < source.length; i++) {
        target[i] = omit(items, source[i]);
      }
    }
    target.length = source.length;
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
    const isThenBranch = isSchemaObject(condition)
      ? validator.isValid(condition, rootSchema, source)
      : condition;
    const branch = isThenBranch ? then : otherwise;
    return branch === undefined ? target : omit(branch, source, target, false);
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
    const bestIndex = getClosestMatchingOption(
      validator,
      merger,
      rootSchema,
      source,
      oneOf.map((d) =>
        isSchemaObject(d) && d.additionalProperties === false
          ? allowAdditionalProperties(d)
          : d
      ),
      0,
      getDiscriminatorFieldFromSchema(schema)
    );
    return omit(oneOf[bestIndex]!, source, target, false);
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
      for (let i = 0; i < anyOf.length; i++) {
        target = omit(anyOf[i]!, source, target, false);
      }
      return target;
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
      target = omit(deps, source, target, false);
    }
    return target;
  }

  /**
   * `materializeSource` controls the fallback for schemas that do not build a
   * cleaned target, such as `true`, `{}`, or primitive schemas. The top-level
   * schema application may return the original source in that case, but
   * compositional constraint branches pass `false` so a permissive branch does
   * not turn the source object/array into the accumulator for later pruning.
   */
  function omit(
    schema: SchemaDefinition,
    source: SchemaValue | undefined,
    target?: SchemaValue,
    materializeSource = true
  ): SchemaValue | undefined {
    if (source === undefined || schema === false) {
      return undefined;
    }
    if (schema === true || isRecordEmpty(schema)) {
      return target ?? (materializeSource ? source : undefined);
    }
    const { $ref: ref, allOf } = schema;
    if (ref !== undefined) {
      return omit(
        resolveRef(ref, rootSchema),
        source,
        target,
        materializeSource
      );
    }
    if (allOf) {
      schema = merger.mergeAllOf(schema);
      // NOTE: When merging schemas with the keywords `if/then/else`,
      // `allOf` may remain
      const remainingAllOf = schema.allOf;
      if (remainingAllOf) {
        for (let i = 0; i < remainingAllOf.length; i++) {
          target = omit(remainingAllOf[i]!, source, target, false);
        }
      }
    }
    target = handleAnyOf(
      schema,
      source,
      handleOneOf(schema.oneOf, schema, source, target)
    );
    const type = getSimpleSchemaType(schema);
    let objectSchema: ObjectSchema | undefined;
    if (type === "object") {
      if (!isSchemaObjectValue(source)) {
        return undefined;
      }
      objectSchema = computeObjectSchema(schema);
      target = handleObject(
        objectSchema,
        source,
        isSchemaObjectValue(target) ? target : {}
      );
    } else if (type === "array") {
      if (!isSchemaArrayValue(source)) {
        return undefined;
      }
      // Preserve arrays without item constraints
      if (schema.items !== undefined) {
        target = handleArray(
          schema,
          source,
          isSchemaArrayValue(target) ? target : []
        );
      }
    }

    target = handleDependencies(
      schema,
      source,
      handleConditions(schema, source, target)
    );

    // Prune additional properties
    if (schema.additionalProperties === false && isSchemaObjectValue(target)) {
      objectSchema ??= computeObjectSchema(schema);
      for (const key of Object.keys(target)) {
        if (
          !objectSchema.localProperties.has(key) &&
          !objectSchema.patterns?.some(([pattern]) => pattern.test(key))
        ) {
          delete target[key];
        }
      }
    }

    return target ?? (materializeSource ? source : undefined);
  }

  return omit(rootSchema, value);
}
