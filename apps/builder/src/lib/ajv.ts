import type { Ajv } from "ajv";

import { isValidJson } from "$lib/json.js";

export function addJsonFormat(ajv: Ajv): Ajv {
  ajv.addFormat("json", isValidJson);
  return ajv;
}
