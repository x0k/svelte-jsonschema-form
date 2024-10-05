import { ADDITIONAL_PROPERTY_FLAG, type Schema } from "./schema";

export function isAdditionalProperty(
  properties: Exclude<Schema["properties"], undefined>,
  property: string
) {
  const propertySchema = properties[property];
  if (typeof propertySchema === "boolean") {
    return false;
  }
  return ADDITIONAL_PROPERTY_FLAG in propertySchema;
}
