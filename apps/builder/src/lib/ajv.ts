import type { Ajv } from "ajv";

import { isValidJson } from "$lib/json.js";
import { isValidRegExp } from "$lib/reg-exp.js";

export function addBuilderFormats(ajv: Ajv): Ajv {
  ajv.addFormat("json", isValidJson);
  ajv.addFormat("regexp", isValidRegExp);
  return ajv;
}
