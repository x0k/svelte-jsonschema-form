import type { Ajv, Options } from "ajv";

import { ADDITIONAL_PROPERTY_FLAG } from "@sjsf/form/core";

export const DEFAULT_AJV_CONFIG = {
  allErrors: true,
  multipleOfPrecision: 8,
  strict: false,
  verbose: true,
  discriminator: true,
} satisfies Options;

export const COLOR_FORMAT_REGEX =
  /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/;

export const DATA_URL_FORMAT_REGEX =
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;

export function addFormFormats(ajv: Ajv) {
  ajv.addFormat("color", COLOR_FORMAT_REGEX);
  ajv.addFormat("data-url", DATA_URL_FORMAT_REGEX);
  return ajv;
}

export function addFormKeywords(ajv: Ajv) {
  ajv.addKeyword(ADDITIONAL_PROPERTY_FLAG);
  return ajv;
}

export function addFormComponents(ajv: Ajv) {
  return addFormKeywords(addFormFormats(ajv));
}
