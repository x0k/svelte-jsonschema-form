function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function convertSchema(schema: unknown): unknown {
  if (typeof schema === "boolean" || !isObject(schema)) {
    return schema;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (value === undefined) continue;

    switch (key) {
      case "definitions":
        result.$defs = convertRecordOfSchemas(value);
        break;

      case "dependencies":
        convertDependencies(result, value);
        break;

      case "items":
        if (Array.isArray(value)) {
          result.prefixItems = value.map(convertSchema);
        } else {
          result.items = convertSchema(value);
        }
        break;

      case "additionalItems":
        if (result.prefixItems) {
          result.items = convertSchema(value);
        } else {
          result.additionalItems = convertSchema(value);
        }
        break;

      case "additionalProperties":
        result.unevaluatedProperties = convertSchema(value);
        break;

      case "properties":
        result.properties = convertRecordOfSchemas(value);
        break;

      case "patternProperties":
        result.patternProperties = convertRecordOfSchemas(value);
        break;

      case "allOf":
      case "anyOf":
      case "oneOf":
        result[key] = (value as unknown[]).map(convertSchema);
        break;

      case "if":
      case "then":
      case "else":
      case "not":
      case "contains":
      case "propertyNames":
      case "$ref":
      case "$defs":
        result[key] = convertSchema(value);
        break;

      default:
        result[key] = value;
        break;
    }
  }

  return result;
}

function convertRecordOfSchemas(obj: unknown): Record<string, unknown> {
  if (!isObject(obj)) return {};
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = convertSchema(value);
  }
  return result;
}

function convertDependencies(
  target: Record<string, unknown>,
  dependencies: unknown
): void {
  if (!isObject(dependencies)) return;

  const dependentSchemas: Record<string, unknown> = {};
  const dependentRequired: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(dependencies)) {
    if (Array.isArray(value)) {
      dependentRequired[key] = value;
    } else {
      dependentSchemas[key] = convertSchema(value);
    }
  }

  if (Object.keys(dependentSchemas).length > 0) {
    target.dependentSchemas = dependentSchemas;
  }
  if (Object.keys(dependentRequired).length > 0) {
    target.dependentRequired = dependentRequired;
  }
}

export function convertDraft07To2020(schema: object): object {
  const result = convertSchema(schema) as Record<string, unknown>;
  result.$schema = "https://json-schema.org/draft/2020-12/schema";
  return result;
}
