// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/getOptionMatchingSimpleDiscriminator.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/getDiscriminatorFieldFromSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  DISCRIMINATOR_KEY,
  PROPERTY_NAME_KEY,
  type Schema,
  type SchemaValue,
} from "./schema";
import { isSchemaObjectValue } from "./value";

export function getDiscriminatorFieldFromSchema(
  schema: Schema
): string | undefined {
  if (
    !(DISCRIMINATOR_KEY in schema) ||
    !isSchemaObjectValue(schema[DISCRIMINATOR_KEY])
  ) {
    return undefined;
  }
  const discriminator = schema[DISCRIMINATOR_KEY][PROPERTY_NAME_KEY];
  const type = typeof discriminator;
  if (type === "string") {
    // @ts-expect-error one day typescript will realize
    return discriminator;
  }
  if (type !== "undefined") {
    console.warn(
      `Expecting discriminator to be a string, got "${type}" instead`
    );
  }
  return undefined;
}

export function getOptionMatchingSimpleDiscriminator<T extends SchemaValue>(
  formData: T | undefined,
  options: Schema[],
  discriminatorField?: string
): number | undefined {
  if (discriminatorField && isSchemaObjectValue(formData)) {
    const value = formData[discriminatorField];
    if (value === undefined) {
      return;
    }
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const discriminator = option.properties?.[discriminatorField] ?? {};
      if (discriminator === true) {
        return i;
      }
      if (
        discriminator === false ||
        discriminator.type === "object" ||
        discriminator.type === "array"
      ) {
        continue;
      }
      if (discriminator.const === value) {
        return i;
      }
      if ((discriminator.enum as SchemaValue[] | undefined)?.includes(value)) {
        return i;
      }
    }
  }
  return;
}
