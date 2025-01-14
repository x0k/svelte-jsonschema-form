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
} from "./core/index.js";

export function omitExtraData(
  validator: Validator,
  merger: Merger2,
  rootSchema: Schema,
  value: SchemaValue | undefined
): SchemaValue | undefined {
  function handleObject(
    schema: Schema,
    source: SchemaValue | undefined,
    target: SchemaObjectValue
  ): SchemaObjectValue {
    if (!isSchemaObjectValue(source)) {
      return target;
    }
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
      const v = omit(schemaDef, value);
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
          continue
        }
        const found = patterns.find((e) => e[0].test(key))
        if (found === undefined) {
          continue
        }
        setProperty(key, found[1], value)
      }
    }
    if (propertyNames !== undefined) {
      for (const [key, value] of Object.entries(source)) {
        target[key] = value
      }
    }
    return target
  }

  function omit(
    schema: SchemaDefinition,
    source: SchemaValue | undefined,
    target?: SchemaValue
  ): SchemaValue | undefined {
    if (!isSchema(schema)) {
      return source;
    }
    const { $ref: ref } = schema;
    if (ref !== undefined) {
      return omit(resolveRef(ref, rootSchema), source, target);
    }
    const type = getSimpleSchemaType(schema);
    if (type === "object") {
      target = handleObject(
        schema,
        source,
        isSchemaObjectValue(target) ? target : {}
      );
    }
  }

  return omit(rootSchema, value);
}
