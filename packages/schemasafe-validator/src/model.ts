import type { ValidatorOptions } from "@exodus/schemasafe";

export const FORM_FORMATS = {
  "data-url": /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/,
} as const satisfies ValidatorOptions["formats"];

export const DEFAULT_VALIDATOR_OPTIONS = {
  includeErrors: true,
  allErrors: true,
  $schemaDefault: "http://json-schema.org/draft-07/schema",
  extraFormats: true,
  formats: FORM_FORMATS,
} as const satisfies ValidatorOptions;
