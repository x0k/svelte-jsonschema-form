import { ADDITIONAL_PROPERTY_FLAG, type Schema } from "./schema.js";

export function isAdditionalProperty(
  properties: Exclude<Schema["properties"], undefined>,
  property: string
) {
  const propertySchema = properties[property];
  if (typeof propertySchema === "boolean" || !propertySchema) {
    return false;
  }
  return ADDITIONAL_PROPERTY_FLAG in propertySchema;
}
