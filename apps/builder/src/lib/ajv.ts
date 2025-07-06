import type { Ajv } from "ajv";

import { parseJson } from "$lib/json.js";

export function addJsonFormat(ajv: Ajv): Ajv {
  ajv.addFormat("json", (data: string) => parseJson(data).ok);
  return ajv;
}
